

export function visitDeepWithResult<T, R>(node: T, parentResult: R | null, childrenProp: keyof T, visitor: (node: T, parentResult: R | null) => R): R {
  let result = visitor(node, parentResult);
  if (node[childrenProp]) {
    for (let child of node[childrenProp] as any) {
      visitDeepWithResult(child, parentResult, childrenProp,  visitor);
    }
  }
  return result;
}

export function visitDeep<T, R>(nodes: T[], childrenProp: keyof T, visitor: (node: T) => void): void  {
  if (nodes) {
    for (let node of nodes) {
      visitor(node);
      if (node[childrenProp]) {
        visitDeep(node[childrenProp] as any, childrenProp, visitor);
      }
    }
  }
}
