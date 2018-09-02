export interface WorshipCondition {
  id: string;
  name: string;
  fullName: string;
  type: "local" | "church_type" | "group"; 
  children: WorshipCondition[];
  parentConditionId: string;
}
export interface LocalWorshipCondition extends WorshipCondition {
  adress?: string;
  mapsUrl?: string;
  siteUrl: string;
}
export interface ChurchTypeWorshipCondition extends WorshipCondition {
  churchType?: string;
}
