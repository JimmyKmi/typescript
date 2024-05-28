// @generated by protoc-gen-es v1.9.0
// @generated from file zitadel/settings/v2beta/security_settings.proto (package zitadel.settings.v2beta, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
} from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message zitadel.settings.v2beta.SecuritySettings
 */
export declare class SecuritySettings extends Message<SecuritySettings> {
  /**
   * @generated from field: zitadel.settings.v2beta.EmbeddedIframeSettings embedded_iframe = 1;
   */
  embeddedIframe?: EmbeddedIframeSettings;

  /**
   * @generated from field: bool enable_impersonation = 2;
   */
  enableImpersonation: boolean;

  constructor(data?: PartialMessage<SecuritySettings>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "zitadel.settings.v2beta.SecuritySettings";
  static readonly fields: FieldList;

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): SecuritySettings;

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): SecuritySettings;

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): SecuritySettings;

  static equals(
    a: SecuritySettings | PlainMessage<SecuritySettings> | undefined,
    b: SecuritySettings | PlainMessage<SecuritySettings> | undefined,
  ): boolean;
}

/**
 * @generated from message zitadel.settings.v2beta.EmbeddedIframeSettings
 */
export declare class EmbeddedIframeSettings extends Message<EmbeddedIframeSettings> {
  /**
   * @generated from field: bool enabled = 1;
   */
  enabled: boolean;

  /**
   * @generated from field: repeated string allowed_origins = 2;
   */
  allowedOrigins: string[];

  constructor(data?: PartialMessage<EmbeddedIframeSettings>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "zitadel.settings.v2beta.EmbeddedIframeSettings";
  static readonly fields: FieldList;

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): EmbeddedIframeSettings;

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): EmbeddedIframeSettings;

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): EmbeddedIframeSettings;

  static equals(
    a:
      | EmbeddedIframeSettings
      | PlainMessage<EmbeddedIframeSettings>
      | undefined,
    b:
      | EmbeddedIframeSettings
      | PlainMessage<EmbeddedIframeSettings>
      | undefined,
  ): boolean;
}