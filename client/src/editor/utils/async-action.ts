import { Toaster } from "@blueprintjs/core";

export class AsyncAtion {
  saving = false;

  async go(action: () => Promise<void>) {
    if (!this.saving) {
      this.saving = true;
      try {
        await action();
      } catch (err) {
        let toaster = new Toaster();
        toaster.show({
          icon: "error",
          intent: "danger",
          message: "Не удалось выполнить оперцию: " + err
        });
        throw err;
      } finally {
        this.saving = false;
      }
    }
  }  
}