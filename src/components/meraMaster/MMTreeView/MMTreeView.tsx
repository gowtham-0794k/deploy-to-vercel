import { MinusSquare, PlusSquare, CloseSquare } from "components/meraMaster";
import React from "react";
import { alpha, TreeView, styled } from "utils/genericExports/theme-imports";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";

export const MMTreeView = ({ data }: any) => {
  // console.log("data in tree",data)
  const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      "& .close": {
        opacity: 0.3,
      },
    },
    [`& .${(treeItemClasses as any).group}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
  }));

  const renderTree = (nodes: any) => (
    <StyledTreeItem
      key={nodes.id}
      nodeId={nodes.id.toString()}
      label={nodes.name}
    >
      {nodes.levelOne && nodes.levelOne.length > 0
        ? nodes.levelOne.map((levelOneNode: any) => renderTree(levelOneNode))
        : null}
      {nodes.levelTwo && nodes.levelTwo.length > 0
        ? nodes.levelTwo.map((levelTwoNode: any) => renderTree(levelTwoNode))
        : null}
        {nodes.levelThree && nodes.levelThree.length > 0
        ? nodes.levelThree.map((levelThreeNode: any) => renderTree(levelThreeNode))
        : null}
    </StyledTreeItem>
  );

  console.log({ data });

  return (
    <TreeView
      aria-label="customized"
      defaultExpanded={["1"]}
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      defaultEndIcon={<CloseSquare />}
    >
      {data?.map((node: any) => renderTree(node))}
    </TreeView>
  );
};
