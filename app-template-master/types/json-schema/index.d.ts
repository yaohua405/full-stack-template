//==================================================================================================
// JSON Schema Draft 2022
//==================================================================================================
// https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-01
//--------------------------------------------------------------------------------------------------

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JSONSchema22TypeName =
  | "string" //
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"
  | "null"

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JSONSchema22Type =
  | string //
  | number
  | boolean
  | JSONSchema22Object
  | JSONSchema22Array
  | null

// Workaround for infinite type recursion
export interface JSONSchema22Object {
  [key: string]: JSONSchema22Type
}

// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface JSONSchema22Array extends Array<JSONSchema22Type> {}

/**
 * Meta schema
 *
 * Recommended values:
 * - 'http://json-schema.org/schema#'
 * - 'http://json-schema.org/hyper-schema#'
 * - 'http://json-schema.org/draft-07/schema#'
 * - 'http://json-schema.org/draft-07/hyper-schema#'
 *
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-5
 */
export type JSONSchema22Version = string

/**
 * JSON Schema v7
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
 */
export type JSONSchema22Definition = JSONSchema22 | boolean
export interface JSONSchema22 {
  $id?: string | undefined
  $ref?: string | undefined
  $schema?: JSONSchema22Version | undefined
  $comment?: string | undefined
  $anchor?: string | undefined

  /**
   * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
   * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
   */
  $defs?:
    | {
        [key: string]: JSONSchema22Definition
      }
    | undefined

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
   */
  type?: JSONSchema22TypeName | JSONSchema22TypeName[] | undefined
  enum?: JSONSchema22Type[] | undefined
  const?: JSONSchema22Type | undefined

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
   */
  multipleOf?: number | undefined
  maximum?: number | undefined
  exclusiveMaximum?: number | undefined
  minimum?: number | undefined
  exclusiveMinimum?: number | undefined

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
   */
  maxLength?: number | undefined
  minLength?: number | undefined
  pattern?: string | undefined

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
   */
  items?: JSONSchema22Definition | JSONSchema22Definition[] | undefined
  additionalItems?: JSONSchema22Definition | undefined
  maxItems?: number | undefined
  minItems?: number | undefined
  uniqueItems?: boolean | undefined
  contains?: JSONSchema22 | undefined
  minContains?: number | undefined
  maxContains?: number | undefined

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
   */
  maxProperties?: number | undefined
  minProperties?: number | undefined
  required?: string[] | undefined
  properties?:
    | {
        [key: string]: JSONSchema22Definition
      }
    | undefined
  patternProperties?:
    | {
        [key: string]: JSONSchema22Definition
      }
    | undefined
  additionalProperties?: JSONSchema22Definition | undefined
  dependentRequired?:
    | {
        [key: string]: JSONSchema22Definition | string[]
      }
    | undefined
  propertyNames?: JSONSchema22Definition | undefined

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
   */
  if?: JSONSchema22Definition | undefined
  then?: JSONSchema22Definition | undefined
  else?: JSONSchema22Definition | undefined

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
   */
  allOf?: JSONSchema22Definition[] | undefined
  anyOf?: JSONSchema22Definition[] | undefined
  oneOf?: JSONSchema22Definition[] | undefined
  not?: JSONSchema22Definition | undefined

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
   */
  format?: string | undefined

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
   */
  contentMediaType?: string | undefined
  contentEncoding?: string | undefined
  contentSchema?: JSONSchema22Definition | undefined

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
   */
  title?: string | undefined
  description?: string | undefined
  default?: JSONSchema22Type | undefined
  readOnly?: boolean | undefined
  writeOnly?: boolean | undefined
  examples?: JSONSchema22Type | undefined
}
