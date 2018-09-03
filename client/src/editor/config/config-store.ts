import { DEFAULT_CONFIG } from "./default-config";
import GoldenLayout from "golden-layout";

const LOCAL_STORAGE_CONFIG_KEY =  "current-config";

export async function loadConfig() {
  let config = DEFAULT_CONFIG;
  let storageVal = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
  if (storageVal) {
    config = JSON.parse(storageVal);
  }
  return config;
}

export async function saveConfig(config: GoldenLayout.Config) {
  
}