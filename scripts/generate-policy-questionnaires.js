const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const output = path.join(root, 'POLICY_PER_FILE_QUESTIONNAIRES.md')
const excluded = /kubernetes|\baks\b|\bk8s\b|container|openshift|azure[\s-]*government|govcloud|usgov/i

function filesIn (directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory() ? filesIn(fullPath) : entry.name.endsWith('.json') ? [fullPath] : []
  }).sort((left, right) => left.localeCompare(right, 'en'))
}

function readDefinitions (directory) {
  return filesIn(path.join(root, 'built-in-policies', directory)).map(file => {
    const relativePath = path.relative(root, file).replace(/\\/g, '/')
    const source = fs.readFileSync(file, 'utf8')
    return { relativePath, source, json: JSON.parse(source), excluded: excluded.test(relativePath + '\n' + source) }
  })
}

function clean (value) {
  return String(value == null ? 'not specified' : value).replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim()
}

function fileLink (file) {
  const target = file.relativePath.split('/').map(segment => encodeURIComponent(segment).replace(/[()]/g, character => '%' + character.charCodeAt(0).toString(16))).join('/')
  return `[${clean(file.relativePath)}](${target})`
}

function question (text) {
  return `- ${text} _____`
}

function fieldsIn (node, result = new Set()) {
  if (Array.isArray(node)) {
    node.forEach(item => fieldsIn(item, result))
  } else if (node && typeof node === 'object') {
    if (typeof node.field === 'string') result.add(node.field)
    if (node.count && typeof node.count.field === 'string') result.add(node.count.field)
    Object.values(node).forEach(value => fieldsIn(value, result))
  }
  return [...result]
}

function hasKey (node, key) {
  if (!node || typeof node !== 'object') return false
  if (Object.prototype.hasOwnProperty.call(node, key)) return true
  return Object.values(node).some(value => Array.isArray(value) ? value.some(item => hasKey(item, key)) : hasKey(value, key))
}

function hasValueExpression (node) {
  if (!node || typeof node !== 'object') return false
  if (typeof node.value === 'string' && node.value.startsWith('[')) return true
  return Object.values(node).some(value => Array.isArray(value) ? value.some(hasValueExpression) : hasValueExpression(value))
}

function parameterQuestions (parameters, isSet = false) {
  return Object.entries(parameters || {}).map(([name, parameter]) => question(
    `For ${isSet ? 'set ' : ''}parameter \`${clean(name)}\` (type \`${clean(parameter.type)}\`${Object.prototype.hasOwnProperty.call(parameter, 'defaultValue') ? `, current default \`${clean(JSON.stringify(parameter.defaultValue))}\`` : ', no current default'}${parameter.allowedValues ? `, allowed values \`${clean(JSON.stringify(parameter.allowedValues))}\`` : ''}), what exact type, metadata, default, allowed values, and ${isSet ? 'member mappings' : 'rule references'} belong in the output JSON?`
  ))
}

function definitionQuestions (file) {
  const properties = file.json.properties || {}
  const rule = properties.policyRule || {}
  const details = (rule.then || {}).details
  const effect = (rule.then || {}).effect
  const effectParameter = typeof effect === 'string' ? (effect.match(/^\[parameters\('([^']+)'\)\]$/) || [])[1] : undefined
  const effectOptions = effectParameter ? properties.parameters?.[effectParameter] : undefined
  const defaultEffect = effectOptions ? effectOptions.defaultValue : effect
  const allowedEffects = new Set((effectOptions?.allowedValues || [defaultEffect || effect]).map(value => String(value).toLowerCase()))
  const fields = fieldsIn(rule.if || {})
  const lines = [
    `## ${clean(properties.displayName || file.json.name || path.basename(file.relativePath))}`,
    '',
    question(`For source ${fileLink(file)} (ID \`${clean(file.json.id)}\`), what new or revised custom definition name and JSON output path are required, or should this existing definition be reused?`),
    question(`What exact \`displayName\`, \`description\`, \`metadata.category\`, and optional version should replace the source values (current category \`${clean(properties.metadata?.category)}\`, mode \`${clean(properties.mode)}\`)?`),
    question(`Which resource types and \`mode\` must be targeted, and what should happen for unrelated resources?`),
    question(`Which \`policyRule.if\` conditions on ${fields.length ? fields.map(field => `\`${clean(field)}\``).join(', ') : 'the evaluated resource'} must be kept, changed, or removed? What exact \`field\`/\`value\`/operator and \`allOf\`/\`anyOf\`/\`not\` tree should be written?`),
    question('How should the rule behave for a compliant resource, a violating resource, an absent property, and an empty array?')
  ]

  if (hasKey(rule.if, 'count')) lines.push(question('What exact `count.field` or `count.value`, `where`, comparison operator, and threshold are required for each array condition?'))
  if (hasValueExpression(rule.if)) lines.push(question('Which `value` expressions need guards against missing data or function errors?'))
  lines.push(...parameterQuestions(properties.parameters))
  lines.push(question(`What \`then.effect\` should apply (currently \`${clean(effect)}\`${defaultEffect && defaultEffect !== effect ? `, default \`${clean(defaultEffect)}\`` : ''}), and which effect parameter values are compatible with the same \`then.details\` shape?`))

  if (allowedEffects.has('auditifnotexists') || allowedEffects.has('deployifnotexists')) {
    lines.push(question(`What related-resource \`details.type\`, \`name\`, \`existenceScope\`, \`resourceGroupName\`, \`evaluationDelay\`, and \`existenceCondition\` are required (current related type \`${clean(details?.type)}\`)?`))
  }
  if (allowedEffects.has('deployifnotexists')) lines.push(question('For `deployIfNotExists`, what `roleDefinitionIds`, `deploymentScope`, incremental deployment template, resource APIs, and template parameter values should `then.details` contain?'))
  if (allowedEffects.has('modify')) lines.push(question('For `modify`, which `roleDefinitionIds`, `conflictEffect`, and `operations[]` (operation, field, value, condition) should `then.details` contain?'))
  if (allowedEffects.has('append')) lines.push(question('For `append`, which `then.details[]` field/value pairs are required, and for array properties should they address the whole array or its members?'))
  if (allowedEffects.has('denyaction')) lines.push(question('For `denyAction`, should `then.details.actionNames` contain `delete`, and which `cascadeBehaviors.resourceGroup` value applies?'))
  if (allowedEffects.has('auditaction')) lines.push(question('For `auditAction`, which operations should `then.details.actionNames` contain?'))
  if (allowedEffects.has('manual')) lines.push(question('For `manual`, what `then.details.defaultState` should the evaluated resource start with?'))
  if (allowedEffects.has('enforcesetting')) lines.push(question('For `enforceSetting`, what exact `then.details.setting.name` and `then.details.setting.value` object or expression should be enforced?'))
  if ([...allowedEffects].some(value => ['auditifnotexists', 'deployifnotexists', 'modify', 'append', 'denyaction', 'auditaction', 'manual', 'enforcesetting'].includes(value)) && details == null) {
    lines.push(question('Which allowed effects require missing `then.details`, or should those effects be removed from `allowedValues`?'))
  }
  if (properties.mode && !['all', 'indexed'].includes(String(properties.mode).toLowerCase())) lines.push(question('Does this provider data mode permit a custom definition, and what mode-specific rule fields and effects are supported?'))
  lines.push(question('Which source fields must be omitted from the custom creation JSON, and do the answered conditions, parameters, effect details, and expected outcomes agree?'))
  return lines.join('\n')
}

function setQuestions (file, definitionsById) {
  const properties = file.json.properties || {}
  const members = properties.policyDefinitions || []
  const lines = [
    `## ${clean(properties.displayName || file.json.name || path.basename(file.relativePath))}`,
    '',
    question(`For source ${fileLink(file)} (ID \`${clean(file.json.id)}\`), what new or revised custom policy set name and JSON output path are required, or should this set be reused?`),
    question(`What \`displayName\`, \`description\`, \`metadata.category\`, and optional version should replace the source values (current category \`${clean(properties.metadata?.category)}\`)?`),
    question('Which existing definitions belong in `policyDefinitions[]`, and does the set definition location allow each reference?'),
    ...parameterQuestions(properties.parameters, true)
  ]
  members.forEach((member, index) => {
    const definition = definitionsById.get(String(member.policyDefinitionId).toLowerCase())
    const name = definition?.json.properties?.displayName || member.policyDefinitionId
    lines.push(question(`For member ${index + 1} \`${clean(member.policyDefinitionReferenceId || '(no reference ID)')}\` (${clean(name)}; ID \`${clean(member.policyDefinitionId)}\`), what full ID, stable reference ID, \`definitionVersion\` (currently \`${clean(member.definitionVersion)}\`), and \`groupNames\` should be written?`))
    const mappings = Object.entries(member.parameters || {}).map(([key, mapped]) => `\`${clean(key)}\` -> \`${clean(JSON.stringify(mapped.value))}\``)
    lines.push(question(`For member ${index + 1}, which parameter mappings must be kept or changed (${mappings.length ? mappings.join('; ') : 'none currently mapped'}), and which declared member defaults should remain unmapped?`))
  })
  if ((properties.policyDefinitionGroups || []).length) lines.push(question('For each existing `policyDefinitionGroups[]` entry, what `name`, `category`, `displayName`, `description`, and optional `additionalMetadataId` should be retained or changed?'))
  lines.push(question('Do all member reference IDs, parameter types and mappings, effects, versions, and group names resolve to the intended definitions without conflicts?'))
  lines.push(question('Which source fields must be omitted from the custom creation JSON, and is the resulting set free of `policyRule` bodies?'))
  return lines.join('\n')
}

const definitions = readDefinitions('policyDefinitions')
const sets = readDefinitions('policySetDefinitions')
const definitionsById = new Map(definitions.filter(file => file.json.id).map(file => [file.json.id.toLowerCase(), file]))
const includedDefinitions = definitions.filter(file => !file.excluded)
const includedSets = sets.filter(file => !file.excluded && (file.json.properties?.policyDefinitions || []).every(member => {
  const referenced = definitionsById.get(String(member.policyDefinitionId).toLowerCase())
  return referenced && !referenced.excluded
}))
const content = [
  '# Policy Definition Questionnaires',
  '',
  ...includedDefinitions.flatMap(file => [definitionQuestions(file), '']),
  '# Policy Set Definition Questionnaires',
  '',
  ...includedSets.flatMap(file => [setQuestions(file, definitionsById), ''])
].join('\n')
if (excluded.test(content)) throw new Error('Generated questionnaire contains an excluded topic')
if (fs.existsSync(output) && fs.readFileSync(output, 'utf8') !== content && !process.argv.includes('--force')) {
  throw new Error('Questionnaire has changed; rerun with --force only when replacing its answers is intended')
}
if (!fs.existsSync(output) || process.argv.includes('--force')) fs.writeFileSync(output, content)
console.log(`Verified ${includedDefinitions.length} definition and ${includedSets.length} policy set questionnaires in ${path.relative(root, output)}`)