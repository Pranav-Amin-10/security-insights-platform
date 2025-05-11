
declare module 'rollup-plugin-javascript-obfuscator' {
  import { Plugin } from 'rollup';
  
  interface ObfuscatorOptions {
    compact?: boolean;
    controlFlowFlattening?: boolean;
    controlFlowFlatteningThreshold?: number;
    deadCodeInjection?: boolean;
    deadCodeInjectionThreshold?: number;
    debugProtection?: boolean;
    debugProtectionInterval?: boolean;
    disableConsoleOutput?: boolean;
    identifierNamesGenerator?: string;
    log?: boolean;
    numbersToExpressions?: boolean;
    renameGlobals?: boolean;
    selfDefending?: boolean;
    simplify?: boolean;
    splitStrings?: boolean;
    splitStringsChunkLength?: number;
    stringArray?: boolean;
    stringArrayCallsTransform?: boolean;
    stringArrayEncoding?: string[];
    stringArrayIndexShift?: boolean;
    stringArrayRotate?: boolean;
    stringArrayShuffle?: boolean;
    stringArrayWrappersCount?: number;
    stringArrayWrappersChainedCalls?: boolean;
    stringArrayWrappersParametersMaxCount?: number;
    stringArrayWrappersType?: string;
    stringArrayThreshold?: number;
    transformObjectKeys?: boolean;
    unicodeEscapeSequence?: boolean;
    [key: string]: any;
  }

  function obfuscatorPlugin(options?: ObfuscatorOptions): Plugin;
  export default obfuscatorPlugin;
}
