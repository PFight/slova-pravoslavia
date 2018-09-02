export interface SourceFileInfo {
  /** Основное полное имя источника */
  name: string;
 /** Короткое имя для основного представления в интерфейсе */
  displayName: string;
  /** Уникальный идентификатор среди всех источников. Должен быть не слишком длинным, удобным для кодирования в url. */
  id: string
  /** Адрес в сети интернет для доступа к файлу */
  url: string;
  /** Адрес файла в файловой системе, при локальной работе с источниками. */
  localUrl: string;
  /** Русский, церковно-славянский, церковно-славянский в гражданском начертании */
  language: "ru" | "chu" | "chu-g" | string;
  format: "html" | "pdf" | "djvu" | "pic";   
}
