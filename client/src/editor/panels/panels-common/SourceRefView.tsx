import styled from 'styled-components';
import { Button } from '@blueprintjs/core';
import React from 'react';
import { SourceRef, SourceRefSource } from '@common/models/SourceRef';
import { getSourceCaption } from './getSourceCaption';
import { CatalogNode } from '@common/models/CatalogNode';

export interface Props {
    sourceRef: SourceRefSource;
    catalogItem?: CatalogNode;
    onSelected: (ref: SourceRefSource) => void;
    onDelete: (ref: SourceRefSource) => void;
}

const local = {
    sourceRef: styled(Button)`
        text-decoration: underline;
        color: blue;
        flex: 1 1 0%;
        min-width: 0;
        justify-content: start;
    `,

    refLine: styled.div`
        display: flex;
        align-items: center;
    `,
    refDeleteButton: styled(Button)`
        flex: 0 0 auto;
    `
}

export const SourceRefView = (props: Props) =>
    <local.refLine>
      <local.sourceRef minimal title={props.sourceRef.comment} onClick={() => props.onSelected(props.sourceRef)}>
        {props.sourceRef.caption || props.catalogItem && getSourceCaption(props.catalogItem, props.sourceRef) || "..."}
      </local.sourceRef>
      <local.refDeleteButton minimal icon="small-cross" onClick={() => props.onDelete(props.sourceRef)} />
    </local.refLine>;