import axios from "axios";
import * as acorn from "acorn";
const estraverse = require("estraverse");


const Babel: any = (window as any).Babel
const System: any = (window as any).System
const ts: any = (window as any).ts


function extractFunctionParameters(str: string) {

  const arrowFunctionRegex = /^(\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/;
  const parameterRegex = /\(([^)]*)\)/;
  const arrowMatch = str.match(arrowFunctionRegex);
  if (arrowMatch) {
    const parameterMatch = arrowMatch[1].match(parameterRegex);
    if (parameterMatch) {
      return parameterMatch[1].split(",").map((param) => param.trim());
    }
  }
  return [];
}

function extractFunctionBody(str: string) {

  const functionBodyRegex = /{([\s\S]*)}/;
  const bodyMatch = str.match(functionBodyRegex);
  if (bodyMatch) {
    return bodyMatch[1].trim();
  }
  return null;
}



export function stringToFunction(soundCode: string) {

  let funcName = null;
  let funcArguments: any[] = [];
  let funcBody = null;

  soundCode = soundCode.replace(/\/\/.*/g, "").trim()
  if (soundCode.startsWith("function") || soundCode.startsWith("export function") || soundCode.startsWith("export default function")) {
    const nameMatch: RegExpMatchArray | null = soundCode.match(
      /(?<=function(\s|\S|\t)*)(\w|_)*?(?=(\t|\s)*\()/g
    );
    const argumentsMatch = soundCode.match(
      /(?<=function(\s)*(\w|_)+\s*\({1}\s*)(\w|,|\x20|\t|\S|\n|\r)*?(?=\s*\))/g
    );
    const bodyMatch = soundCode.match(
      /(?<=((\s|\t|\w|\S)*function(\s|\w|\t|\S)*\((\w|\s|\t|,)*\)(\s|\S)*{))(\s|\S|\w)*(?=})/g
    );
    if (nameMatch !== null)
      funcName = nameMatch[0];
    if (argumentsMatch !== null)
      funcArguments = argumentsMatch[0].split(",").map((item) => item.trim()).filter(item => item !== null && item !== undefined && item.trim() !== "");
    if (bodyMatch !== null)
      funcBody = bodyMatch[0]
  } else if (/^(\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/g.test(soundCode)) {
    funcArguments = extractFunctionParameters(soundCode)
    funcBody = extractFunctionBody(soundCode)
  }

  if (funcBody === null || funcBody === undefined)
    throw new Error("没有函数体")
  // @ts-ignore
  const func = new Function(funcArguments, funcBody);
  return func
}



// "script"：表示代码来源为 JavaScript 脚本文件。
// "module"：表示代码来源为 JavaScript 模块文件。
// "unambiguous"：表示代码来源可能是脚本文件或模块文件，根据代码中的导入和导出语句进行判断。

export function CompileSourcecode(sourceCode: string, sourceType = "module") {

  const module: any = {}

  const ast = acorn.parse(sourceCode, { sourceType: sourceType } as any);
  const functionNodes: any[] = [];
  // 遍历 AST，提取函数节点
  estraverse.traverse(ast, {
    enter: function (node: any) {
      if (["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(node.type))
        functionNodes.push(node);
    },
  });

  // 处理每个函数节点
  functionNodes.forEach((functionNode) => {
    module[functionNode.id?.name] = stringToFunction(sourceCode.slice(functionNode.start, functionNode.end))
  });

  return module
}








function createDownloadElement(content: string, filename = new Date().toISOString()) {
  const element = document.createElement("a");
  const blob = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(blob);
  element.download = filename;
  element.style.display = "none";
  return element

  // document.body.appendChild(element);
  // element.click();

  // document.body.removeChild(element);
  // URL.revokeObjectURL(element.href);
}

export function CompileTypescriptToIIFE(sourceCode: string) {

  const tsCode = ts.transpile(sourceCode, {
    target: ts.ScriptTarget.ES5,
    preserveConstEnums: true,
    allowNonTsExtensions: true,
    isolatedModules: true,
    noEmitOnError: false,
    suppressImplicitAnyIndexErrors: false,
  });

  const className = tsCode.match(/var\s+(\w+)\s+=\s+\/\*\*\s+@class\s+\*\/\s+\(function\s*\(\)\s*{/)[1];
  const iifeCode = `(function() {
                        ${tsCode}
                        return ${className};
                    })()`;
  // @ts-ignore
  const iife = eval(iifeCode);

  // @ts-ignore
  // const iife = new Function(tsCode);
  return iife
}


export function CompileToModule(sourceCode: string) {

  const transformedCode = Babel.transform(sourceCode, {
    plugins: [],
    presets: [
      [
        "stage-2",
        {
          decoratorsBeforeExport: true,
          modules: "systemjs",
        },
      ],
      [
        "es2015",
        {
          decoratorsBeforeExport: true,
          modules: "systemjs",
        },
      ],
    ],
  }).code;
  const a = createDownloadElement(transformedCode);
  // const blob = new Blob([transformedCode], { type: "text/plain" });
  return new Promise((resolve, reject) => {
    System.import(a.href)
      .then((module: any) => {
        URL.revokeObjectURL(a.href);
        resolve(module)
      })
      .catch((error: any) => {
        reject(error)
      });
  })
}







