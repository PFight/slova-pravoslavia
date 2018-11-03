export interface ReactTreeNode<T> {
  nodeData: T;
  module: string;
  children: ReactTreeNode<T>[] | undefined;
  leaf: boolean;
  collapsed: boolean;
  isSelected?: boolean;
  icon?: string | React.ReactNode;
  label?: React.ReactNode;
}