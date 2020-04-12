import { UnionToIntersection } from 'type-fest';

import { AnyFunction, StringKey } from '@remirror/core-types';

import { CommandMethod, GetCommands, GetConstructor } from '../types';
import { AnyExtension } from './extension-base';

export interface ExtensionParameter<ExtensionUnion extends AnyExtension = any> {
  /**
   * An extension.
   */
  extension: ExtensionUnion;
}

export interface ExtensionListParameter<ExtensionUnion extends AnyExtension = AnyExtension> {
  /**
   * The extensions property.
   */
  readonly extensions: readonly ExtensionUnion[];
}

/**
 * A utility type which maps the passed in extension command in an action that
 * is store in the `manager.store.actions.commandName()`.
 */
export type MapToUnchainedCommand<GCommands extends Record<string, AnyFunction>> = {
  [P in keyof GCommands]: CommandMethod<Parameters<GCommands[P]>>;
};

/**
 * A utility type which maps the chained commands.
 */
export type MapToChainedCommand<GCommands extends Record<string, AnyFunction>> = {
  [P in keyof GCommands]: (...args: Parameters<GCommands[P]>) => any;
};

/**
 * Utility type which receives an extension and provides the type of actions it
 * makes available.
 */
export type CommandsFromExtensions<ExtensionUnion extends AnyExtension> = UnionToIntersection<
  MapToUnchainedCommand<GetCommands<ExtensionUnion>>
>;

export type ChainedFromExtensions<ExtensionUnion extends AnyExtension> = {
  [Key in keyof UnionToIntersection<MapToChainedCommand<GetCommands<ExtensionUnion>>>]: (
    ...args: Parameters<MapToChainedCommand<GetCommands<ExtensionUnion>>[Key]>
  ) => ChainedFromExtensions<ExtensionUnion>;
};

/**
 * Utility type for pulling all the action names from a list
 */
export type CommandNames<ExtensionUnion extends AnyExtension> = StringKey<
  CommandsFromExtensions<ExtensionUnion>
>;

/**
 * Retrieve the instance type from an ExtensionConstructor.
 */
export type ExtensionFromConstructor<ExtensionConstructor extends { of: AnyFunction }> = ReturnType<
  ExtensionConstructor['of']
>;

/**
 * Provides a method for retrieving an extension from an extension holder.
 */
export interface GetExtensionParameter<ExtensionUnion extends AnyExtension> {
  /**
   * Get and extension from the extension holder (either a preset or a manager)
   * that corresponds to the provided `Constructor`.
   *
   * @param Constructor - the extension constructor to find in the editor.
   */
  getExtension: <ExtensionConstructor extends GetConstructor<ExtensionUnion>>(
    Constructor: ExtensionConstructor,
  ) => ExtensionFromConstructor<ExtensionConstructor>;
}