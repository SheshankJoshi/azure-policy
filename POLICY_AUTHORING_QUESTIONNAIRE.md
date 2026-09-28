# Policy Definition Questionnaire

## Source definition (complete for each definition being reviewed)

| ID | Question | Answer |
| --- | --- | --- |
| PD00a | Which exact source definition JSON path and `id` is this questionnaire for? | _____ |
| PD00b | Are you reusing that definition unchanged, parameterizing an existing custom definition, or authoring a new custom definition? | _____ |
| PD00c | What is the output JSON path/name, and which source fields must change rather than be copied? | _____ |

| Source path / definition ID | Source `displayName` | Decision (reuse / revise / new) | Output JSON path or N/A | Questionnaire completed? |
| --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ |

## Definition decision matrix

| Question | Select an answer | Answer | JSON destination / questions to complete |
| --- | --- | --- | --- |
| Does the control evaluate the current resource, a related resource, or a provider-specific data surface? | Current / Related / Data | _____ | `mode`, `policyRule.if`; PD11-PD30, PD62-PD70 for Related |
| For a provider data surface, does that exact mode support a new custom definition and the requested effect? | Yes / No / Unverified | _____ | `mode`, `policyRule`; PD48c-PD48g for Data |
| Is the desired action to observe a violation, block a write, alter a write, deploy a related resource, block deletion, or record a manual state? | Observe / Block write / Alter write / Deploy / Block delete / Manual | _____ | `policyRule.then.effect`; PD41-PD48 |
| For an observed violation, is the failing state on the current resource or the absence/incorrect state of a related resource? | Current / Related | _____ | `audit` / `auditIfNotExists`; PD47 or PD62-PD70 |
| For a write alteration, is the intended operation an addition only or a supported add/replace/remove? | Append / Modify | _____ | `then.details[]` (PD49-PD51a) / `then.details.operations[]` (PD55-PD61) |
| Must the related-resource check only report or also deploy a resource? | Report / Deploy | _____ | `auditIfNotExists` (PD62-PD70) / `deployIfNotExists` (PD62-PD77) |
| Does the rule compare scalar fields, array members, or a count of matching array members? | Scalar / Array member / Count | _____ | `if`, optional `count`; PD19-PD28, PD78-PD82 |
| Will any value change between uses of the same definition? | Yes / No | _____ | `properties.parameters` (PD31-PD40) / literals in `if` or `then` |
| Can the chosen effect share the same `if` and `then.details` with other allowed effects? | Yes / No | _____ | Effect parameter with compatible `allowedValues` / fixed `then.effect`; PD41-PD44 |
| Is this intended for a resource group or subscription, or for resources supporting tags and locations? | Group/subscription / Tag/location resource / Other | _____ | `mode` and `if` type guard; PD11-PD16 |

## Definition identity and structure

| ID | Question | Answer |
| --- | --- | --- |
| PD01 | What is the unique definition name used when creating this definition? | _____ |
| PD02 | Is the JSON a creation/update body (`properties`) or a retrieved definition containing `id` and `name`? | _____ |
| PD02a | If creating a custom definition, are retrieved `id`, `name`, `policyType`, and `versions` fields omitted from the creation body? | _____ |
| PD03 | Is this a new custom definition or a revision of an existing custom definition? Which definition ID, if revising? | _____ |
| PD04 | At which subscription or management group will this definition be created? | _____ |
| PD05 | What is `properties.displayName`? | _____ |
| PD06 | What is `properties.description`? | _____ |
| PD07 | What is `properties.metadata.category`? | _____ |
| PD08 | What additional `properties.metadata` keys and values are required? | _____ |
| PD09 | Is a `properties.version` supported and required for this definition? If so, what version? | _____ |
| PD09a | Should the optional `properties.metadata.version` also be set? If yes, what exact value, distinct from `properties.version`? | _____ |
| PD10 | What are the intended `preview` and `deprecated` metadata values, if applicable? | _____ |
| PD11 | Which mode applies: `All`, `Indexed`, or a specifically supported resource-provider mode? What exact value goes in `properties.mode`? | _____ |
| PD12 | If using `Indexed`, do all target resource types support the relevant tags/location evaluation? | _____ |
| PD13 | If evaluating resource groups or subscriptions, is `All` selected and are those types explicitly filtered? | _____ |

## Target resources and rule logic

| ID | Question | Answer |
| --- | --- | --- |
| PD14 | Which exact resource `type` values must match `policyRule.if`? | _____ |
| PD15 | Which exact resource types must never match? | _____ |
| PD16 | Is the evaluated resource a parent, child, or extension resource? What is its exact type and name format? | _____ |
| PD17 | For a direct-resource effect, what violation makes `policyRule.if` true? For a related-resource effect, what parent/resource state triggers the related-resource lookup? | _____ |
| PD18 | What state makes the rule false (compliant or not applicable)? | _____ |
| PD19 | For each property tested, what is its exact policy alias or built-in field name? | _____ |
| PD20 | For each alias, which resource type and API versions expose the required property in GET and create/update requests? | _____ |
| PD21 | For each tested field, what comparison operator (`equals`, `exists`, `in`, `like`, etc.) and comparison value are required? | _____ |
| PD22 | What are the exact `allOf`, `anyOf`, and `not` groupings in `policyRule.if`? | _____ |
| PD23 | What is the required behavior when a property is absent, `null`, empty, or has an unexpected type? | _____ |
| PD24 | If a field contains an array, should none, any, all, or an exact number of members satisfy the condition? | _____ |
| PD25 | If an array is empty, should the rule match? Is `field count` or `value count` required? | _____ |
| PD26 | If comparing fields across an array member, which `[*]` aliases and `count.where` expression refer to the same member? | _____ |
| PD27 | Are resource, resource-group, subscription, or parameter values used in a `value` expression? What is the exact expression? | _____ |
| PD28 | Can any function fail on a missing/short/invalid value? What conditional expression prevents evaluation failure? | _____ |
| PD29 | Is a location, tag, name, kind, identity, or resource ID field being used? What precise comparison is required? | _____ |
| PD30 | Does the property exist only outside the supported policy evaluation surface? If so, what supported field or related resource replaces it? | _____ |

| Condition ID | JSON parent path (`if.allOf[0]`, `if.anyOf[1]`, etc.) | `field` / `value` / `count` source | Operator | Literal or `[parameters('...')]` value | Missing/empty behavior |
| --- | --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ | _____ |

| Logic group ID | Parent group ID or `if` | Operator (`allOf`, `anyOf`, `not`) | Child condition/group IDs in order |
| --- | --- | --- | --- |
| _____ | _____ | _____ | _____ |

## Definition parameters (repeat for every `properties.parameters` entry)

| ID | Question | Answer |
| --- | --- | --- |
| PD31 | What is the parameter key, and at which exact places will `[parameters('...')]` reference it? | _____ |
| PD32 | What is its `type` (`string`, `array`, `object`, `boolean`, `integer`, `float`, or `dateTime`)? | _____ |
| PD33 | What are its `metadata.displayName` and `metadata.description`? | _____ |
| PD34 | Does it require `metadata.strongType`? If so, what supported value? | _____ |
| PD34a | Are any other supported parameter `metadata` fields needed (for example, `portalReview`)? What are their exact keys and JSON values? | _____ |
| PD35 | Does it require `metadata.assignPermissions`? If so, what resource or scope ID is supplied? | _____ |
| PD36 | What is its exact `defaultValue`, with the correct JSON type? | _____ |
| PD37 | What are its `allowedValues`, if any, and is the default among them? | _____ |
| PD38 | If its type is `object`, what input constraints belong in its `schema`? | _____ |
| PD39 | Is this a new parameter on a definition already assigned? If yes, what `defaultValue` preserves existing assignments? | _____ |
| PD40 | Which parameter values are fixed by the definition, and which must remain configurable? | _____ |

| Parameter key | `type` | `metadata.displayName` | `metadata.description` | Other supported `metadata` keys/values or omit | `defaultValue` or omit | `allowedValues` / `schema` or omit | Used at JSON path(s) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ | _____ | _____ | _____ |

## Effect selection

| ID | Question | Answer |
| --- | --- | --- |
| PD41 | What exact `policyRule.then.effect` is required: `audit`, `deny`, `append`, `modify`, `auditIfNotExists`, `deployIfNotExists`, `denyAction`, `manual`, `disabled`, or an effect supported by the selected mode? | _____ |
| PD42 | Is `effect` a fixed literal or a parameter reference? | _____ |
| PD43 | If parameterized, which `allowedValues` share this rule and `then.details` structure without making the definition invalid? | _____ |
| PD44 | If `disabled` is allowed, what is the intended `defaultValue` for the effect parameter? | _____ |
| PD45 | Does the effect evaluate the current resource, a related resource, a write request, or a delete request? | _____ |
| PD46 | If `deny` is selected, what exact violating create/update requests should be blocked? | _____ |
| PD47 | If `audit` is selected, what exact violating resource state should be reported? | _____ |
| PD48 | If `manual` or a provider-specific effect is selected, what exact mode-specific fields and supported effect details are required? | _____ |

## `manual` details (complete only when selected)

| ID | Question | Answer |
| --- | --- | --- |
| PD48a | What initial compliance state belongs in `then.details.defaultState`: `Unknown`, `Compliant`, or `Non-compliant`? If omitted, is the default `Unknown` intended? | _____ |
| PD48b | What exact resource `type` does `if` target for manual attestation? | _____ |

## Provider data mode details (complete only when selected)

| ID | Question | Answer |
| --- | --- | --- |
| PD48c | What exact `properties.mode` string identifies the provider data surface? | _____ |
| PD48d | Does that mode support authoring custom definitions, or only referencing an existing built-in definition? If custom authoring is unsupported, which existing full definition ID will be used instead? | _____ |
| PD48e | What exact provider-managed resource or component is evaluated, and which provider-supported fields/aliases identify a violation? | _____ |
| PD48f | Which `then.effect` values does this specific mode support, and are the requested `then.details` fields valid for it? | _____ |
| PD48g | What is the exact supported `policyRule.if` / `policyRule.then` shape for this mode, including any required provider-specific properties? | _____ |

| `mode` | Custom definition supported? | Evaluated component | Supported `if` fields | Valid `then.effect` / `details` | Existing built-in ID or custom output path |
| --- | --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ | _____ |

## `append` details (complete only when selected)

| ID | Question | Answer |
| --- | --- | --- |
| PD49 | Which exact fields and values belong in `then.details[]`? | _____ |
| PD50 | For each field, should the value be a literal or a parameter expression? | _____ |
| PD51 | What happens when the request already contains a conflicting value? | _____ |
| PD51a | If appending to an array, is `field` the whole-array alias or its `[*]` member alias, and is `value` the entire array or a single member? | _____ |

| `then.details[]` item | `field` | `value` (literal or expression) | Conflict behavior |
| --- | --- | --- | --- |
| _____ | _____ | _____ | _____ |

## `denyAction` details (complete only when selected)

| ID | Question | Answer |
| --- | --- | --- |
| PD52 | Is `then.details.actionNames` set to `["delete"]`? | _____ |
| PD53 | Is `then.details.cascadeBehaviors.resourceGroup` needed, and is its value `allow` or `deny`? | _____ |
| PD54 | Does the selected mode support the chosen cascade behavior? | _____ |

## `modify` details (complete only when selected)

| ID | Question | Answer |
| --- | --- | --- |
| PD55 | Which full role IDs belong in `then.details.roleDefinitionIds`? | _____ |
| PD56 | What is `then.details.conflictEffect` (`audit`, `deny`, or `disabled`)? | _____ |
| PD57 | For each `operations[]` item, what is its `operation` (`add`, `addOrReplace`, or `remove`)? | _____ |
| PD58 | For each operation, what is the exact `field` and, if required, the exact `value`? | _____ |
| PD59 | Does each property alias support modification for the target resource type and request API version? | _____ |
| PD60 | Does an operation need a `condition` to handle a specific API version or request shape? What expression? | _____ |
| PD61 | For each operation, what happens if the alias is not modifiable or the parent property is absent from the request? | _____ |

| `then.details.operations[]` index | `operation` | `field` | `value` or omit | `condition` or omit | Alias modifiable for API versions? |
| --- | --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ | _____ |

## Related-resource details (complete for `auditIfNotExists` or `deployIfNotExists`)

| ID | Question | Answer |
| --- | --- | --- |
| PD62 | What exact related resource `then.details.type` should be queried? | _____ |
| PD63 | Is `then.details.name` required? If so, what exact name or `[field('name')]` / `[field('fullName')]` expression identifies it? | _____ |
| PD64 | Is the related type a child of the evaluated resource, or must policy search the resource group or subscription? | _____ |
| PD65 | What are `then.details.existenceScope` and `resourceGroupName`, if needed? | _____ |
| PD66 | When should related-resource evaluation occur? What is `then.details.evaluationDelay`? | _____ |
| PD67 | What exact `then.details.existenceCondition` makes a related resource acceptable? | _____ |
| PD68 | If several related resources exist, is compliance achieved when any one satisfies that condition? | _____ |
| PD69 | If no related resource exists, what compliance result is required? | _____ |
| PD70 | If the related resource exists but has the wrong properties, what compliance result is required? | _____ |

| `then.details.existenceCondition` condition/group path | Related-resource `field` / `value` / `count` | Operator | Expected value/expression | Match when absent? |
| --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ |

## `deployIfNotExists` deployment (complete only when selected)

| ID | Question | Answer |
| --- | --- | --- |
| PD71 | Which full role IDs belong in `then.details.roleDefinitionIds`? | _____ |
| PD72 | Is `then.details.deploymentScope` `ResourceGroup` or `Subscription`? | _____ |
| PD73 | If deploying at subscription scope, what deployment `location` is required? | _____ |
| PD74 | What is the exact `then.details.deployment.properties.mode` (incremental)? | _____ |
| PD75 | What are the template `$schema`, `contentVersion`, resource `type`, `apiVersion`, `name`, `location`, and required `properties`? | _____ |
| PD76 | Which template parameters are required, and what `deployment.properties.parameters.<name>.value` expression passes each policy value? | _____ |
| PD77 | Which resource group receives the deployment, and will repeated deployments be idempotent? | _____ |

| Template parameter name / `type` | `template.parameters` default or omit | `deployment.properties.parameters.<name>.value` expression | Used by template resource(s) |
| --- | --- | --- | --- |
| _____ | _____ | _____ | _____ |

| Template `resources[]` index | `type` | `apiVersion` | `name` | `location` / omit | `properties` / other required fields |
| --- | --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ | _____ |

## Array/count conditions (repeat for every `count` in `if` or `existenceCondition`)

| ID | Question | Answer |
| --- | --- | --- |
| PD78 | Is the `count` over a resource array (`count.field`) or a literal/parameter array (`count.value`)? What is the exact alias or array expression? | _____ |
| PD79 | If using `count.value`, what is `count.name` when nested, and where is `current('name')` used? | _____ |
| PD80 | What is the full `count.where` condition, including grouped tests that must refer to the same array member? | _____ |
| PD81 | What numeric operator and threshold compare the resulting count (`equals`, `greater`, `greaterOrEquals`, etc.)? | _____ |
| PD82 | Is the count nested? What is its parent count path, and does it target the correct nested array? | _____ |

| Parent JSON path | `count.field` or `count.value` | `count.name` or omit | `count.where` condition/group IDs | Numeric operator | Threshold/expression | Result for empty array |
| --- | --- | --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ | _____ | _____ |

## Rule outcome questions

| ID | Question | Answer |
| --- | --- | --- |
| PD83 | Does `if` match an applicable compliant resource, a violating resource, an unrelated type, and a resource with a missing property exactly as intended? | _____ |
| PD84 | Does any predicate compare only fixed literals or otherwise match every applicable resource? If yes, is that intentional? | _____ |
| PD85 | For a related-resource effect, does `if` select the parent while `existenceCondition` checks the related resource rather than selecting only already-existing children? | _____ |

| Example resource/state | In scope? | `if` true? | `existenceCondition` satisfied? or N/A | Expected effect/compliance outcome |
| --- | --- | --- | --- | --- |
| Compliant: _____ | _____ | _____ | _____ | _____ |
| Violating: _____ | _____ | _____ | _____ | _____ |
| Missing/empty: _____ | _____ | _____ | _____ | _____ |
| Unrelated type: _____ | _____ | _____ | _____ | _____ |

## Definition output checks

| ID | Question | Answer |
| --- | --- | --- |
| PD86 | Does the final `properties` object contain `displayName`, `description`, `mode`, and `policyRule`? Which `metadata`, `parameters`, and `version` fields are included or omitted? | _____ |
| PD87 | Does `policyRule` contain both `if` and `then`, with effect-specific details only when applicable? | _____ |
| PD88 | Which filled answers map to each JSON key, and are any required keys still unanswered? | _____ |

# Policy Set Definition Questionnaire

## Source policy set (complete for each set being reviewed)

| ID | Question | Answer |
| --- | --- | --- |
| PS00a | Which exact source policy set JSON path and `id` is this questionnaire for? | _____ |
| PS00b | Are you reusing that set unchanged, updating an existing custom set, or authoring a new custom set? | _____ |
| PS00c | What is the output JSON path/name, and which source fields or member references must change? | _____ |

| Source path / set ID | Source `displayName` | Decision (reuse / revise / new) | Output JSON path or N/A | Questionnaire completed? |
| --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ |

## Policy set decision matrix

| Question | Select an answer | Answer | JSON destination / questions to complete |
| --- | --- | --- | --- |
| Are the required member definitions already available by full definition ID? | All / Some / None | _____ | `policyDefinitions[].policyDefinitionId`; PS11, PS21-PS22; record missing members before authoring the set |
| Must the same definition be referenced more than once with different values? | Yes / No | _____ | One `policyDefinitions[]` entry and distinct `policyDefinitionReferenceId` per use; PS23-PS29 |
| Are member parameter values shared across entries, exposed independently, fixed as literals, or left at member defaults? | Shared / Separate / Literal / Default per parameter | _____ | `properties.parameters`, `policyDefinitions[].parameters`; PS12-PS20, PS25-PS29 |
| Must the set select a specific member version or allow the supported version wildcard? | Specific / Wildcard / Omit | _____ | `policyDefinitions[].definitionVersion`; PS24 |
| Do definitions need named reporting groups? | Yes / No | _____ | `policyDefinitionGroups[]` and member `groupNames[]` / omit; PS31, PS33-PS37 |
| Are member effects mutually compatible and are all required parameter mappings complete? | Yes / No / Unresolved | _____ | `policyDefinitions[]`; PS28-PS32, PS39 |

## Set identity and structure

| ID | Question | Answer |
| --- | --- | --- |
| PS01 | What is the unique policy set name used when creating this set? | _____ |
| PS02 | Is the JSON a creation/update body (`properties`) or a retrieved set containing `id` and `name`? | _____ |
| PS02a | If creating a custom set, are retrieved `id`, `name`, `policyType`, and `versions` fields omitted from the creation body? | _____ |
| PS03 | Is this a new custom policy set or a revision of an existing set? Which set ID, if revising? | _____ |
| PS04 | At which subscription or management group will the set be defined? | _____ |
| PS05 | What is `properties.displayName`? | _____ |
| PS06 | What is `properties.description`? | _____ |
| PS07 | What is `properties.metadata.category`? | _____ |
| PS08 | What other `properties.metadata` keys and values are required? | _____ |
| PS09 | Is `properties.version` supported and required? If so, what version? | _____ |
| PS09a | Should the optional `properties.metadata.version` also be set? If yes, what exact value, distinct from `properties.version`? | _____ |
| PS10 | What are the intended `preview` and `deprecated` metadata values, if applicable? | _____ |
| PS11 | Which existing policy definitions must be grouped in `properties.policyDefinitions[]`? | _____ |

## Set parameters (repeat for every `properties.parameters` entry)

| ID | Question | Answer |
| --- | --- | --- |
| PS12 | What is the set parameter key, and which member parameter(s) will receive it? | _____ |
| PS13 | What is its `type` (`string`, `array`, `object`, `boolean`, `integer`, `float`, or `dateTime`)? | _____ |
| PS13a | If a value looks numeric or boolean, is its declared type actually `string` in every receiving definition? What exact JSON type must be retained? | _____ |
| PS14 | What are its `metadata.displayName` and `metadata.description`? | _____ |
| PS15 | Does it need `metadata.strongType` or `metadata.assignPermissions`? What exact values? | _____ |
| PS15a | Are other supported parameter metadata keys needed (for example, `portalReview`)? What exact keys and JSON values? | _____ |
| PS16 | What is its exact `defaultValue`, if any, with the correct JSON type? | _____ |
| PS17 | What are its `allowedValues`, if any, and are these compatible with every receiving member parameter? | _____ |
| PS18 | If the parameter is an object, what object shape do receiving member definitions require, and are all mapped values compatible? | _____ |
| PS19 | If adding this parameter to an already assigned set, what default keeps existing assignments valid? | _____ |
| PS20 | Should different member parameters share this value, be exposed as separate set parameters, or receive fixed literal values? | _____ |

| Set parameter key | `type` | `metadata.displayName` / `description` | Other supported `metadata` or omit | `defaultValue` or omit | `allowedValues` or omit | Receiving member reference ID(s) / parameter key(s) |
| --- | --- | --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ | _____ | _____ |

## Included definitions (repeat for every `properties.policyDefinitions[]` entry)

| ID | Question | Answer |
| --- | --- | --- |
| PS21 | What is this member's full `policyDefinitionId`? | _____ |
| PS22 | Is this definition visible from the policy set's definition location? | _____ |
| PS23 | What unique, stable `policyDefinitionReferenceId` identifies this entry, including if the same definition appears more than once? | _____ |
| PS24 | Is `definitionVersion` required for this member? If so, what exact version or supported wildcard pattern? | _____ |
| PS25 | What parameters does this member definition declare, and which of them are required? | _____ |
| PS26 | For each member parameter, what is its exact `policyDefinitions[].parameters.<name>.value`? | _____ |
| PS27 | For each mapped value, is it a literal or a `[parameters('setParameterName')]` expression? | _____ |
| PS28 | Do each member parameter's type, allowed values, and default agree with the supplied value? | _____ |
| PS29 | If a member parameter is not mapped, will its definition default produce the intended behavior? | _____ |
| PS30 | What is this member's resulting effect after its effect parameter, if any, is mapped? | _____ |
| PS31 | Does this member belong to a group? If so, what names go in `groupNames[]`? | _____ |
| PS32 | Does this entry duplicate, contradict, or depend on another member's rule or effect? Which entry? | _____ |

| `policyDefinitions[]` index | `policyDefinitionId` | `policyDefinitionReferenceId` | `definitionVersion` or omit | `groupNames[]` or omit |
| --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ |

| Member `policyDefinitionReferenceId` | Member `parameters.<name>` | Exact `.value` (literal or `[parameters('setKey')]`) | Member type / allowed values checked? | Omit mapping and use member default? |
| --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ |

| Member reference ID | Effective member effect | Effective value of every required member parameter | Expected group name(s) or omit | Member definition ID/version resolved? |
| --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ |

## Definition groups (repeat for every `properties.policyDefinitionGroups[]` entry)

| ID | Question | Answer |
| --- | --- | --- |
| PS33 | Is `policyDefinitionGroups[]` needed? | _____ |
| PS34 | What unique group `name` will member `groupNames[]` reference? | _____ |
| PS35 | What are this group's `displayName`, `description`, and `category`, if applicable? | _____ |
| PS36 | Is `additionalMetadataId` applicable and available, or should it be omitted? | _____ |
| PS37 | Does every `groupNames[]` value in every member match a declared group `name`? | _____ |

| `policyDefinitionGroups[]` index | `name` | `displayName` or omit | `description` or omit | `category` or omit | `additionalMetadataId` or omit |
| --- | --- | --- | --- | --- | --- |
| _____ | _____ | _____ | _____ | _____ | _____ |

## Set output checks

| ID | Question | Answer |
| --- | --- | --- |
| PS38 | Does the final `properties` object contain `displayName`, `description`, and `policyDefinitions[]`? Which `metadata`, `parameters`, and `version` fields are included or omitted? | _____ |
| PS39 | Are all member definition IDs, reference IDs, version choices, and parameter mappings fully specified? | _____ |
| PS40 | Is `policyDefinitionGroups[]` included only when needed and mapped to the intended members? | _____ |
| PS41 | Does the policy set omit `policyRule` and contain references to policy definitions instead? | _____ |
| PS42 | Which filled answers map to each JSON key, and are any required keys still unanswered? | _____ |