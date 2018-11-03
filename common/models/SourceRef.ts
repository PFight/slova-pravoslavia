export interface SourceRef {
  /** Комментарий составителя */
  comment?: string;
  /** Логическое название отсылки (например, Псалом 64). */
  caption?: string;
  /** Источники. Каждая запись ялвляется дублирующей (например, на разных языках, в разных форматах). */
  sources: SourceRefSource[]
}

export interface SourceRefSource {
  /** Логическое название источника. Например, "Русский перевод". */
  caption?: string;
  /** Комментарий к данной ссылке на источник */
  comment?: string;
  /** Русский, церковно-славянский, церковно-славянский в гражданском начертании */
  language: "ru" | "chu" | "chu-gr" | string;
  format: "html" | "pdf" | "djvu" | "pic";

  /** Интервалы выделения в исходном файле */
  ranges: SourceRange[];
}

export interface SourceRange {
  /** Идентификатор исходного файла */
  sourceFileId: string;
  /** Порядок в массиве {@see ranges} */
  order?: number;
  /** Идентификатор узла начала интервала. Тип зависит от источника. Может быть номер страницы и т.д. */
  beginNodeId: string;
  /** Смещение начала интервала в узле, указанном в {@see beginNodeId} */
  beginNodeStartShift?: string;
    /** Идентификатор узла конца интервала. Может равняться {@see beginNodeId}. */
  endNodeId: string;
    /** Смещение конца интервала в узле, указанном в {@see endNodeId} */
  endNodeFinishShift?: string;
  /** Заголовок раздела, в котором расположен интервал */
  caption?: string;
  
  /** Текст интервала для поддержания возможности восстановления сопоставлений при утрате идентификаторов в исходном файле. */
  hintText?: string;
}
