sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/ValueState"],
  function (BaseController, JSONModel, ValueState) {
    "use strict";

    return BaseController.extend("sap.nexus.zdewmo.controller.Detail", {
      onInit: function () {
        this.oRouter = this.getRouter();

        this.oRouter.getRoute("detail").attachPatternMatched(this.afterMatched, this);

        this.setModel(
          new JSONModel({
            busy: false,
            delay: 0,
          }),
          "detail"
        );

      },

      afterMatched: function (oEvent) {
        const oArg = oEvent.getParameter("arguments");
        const items = this.getModel("item").getProperty("/so_items");
        const oItem = items.find((i) => {
          return (
            i.Vbeln == oArg.vbeln &&
            i.Posnr == oArg.posnr
          );
        });

        this.getModel("detail").setProperty("/VBELN", oItem.Vbeln);
        this.getModel("detail").setProperty("/POSNR", oItem.Posnr);
        this.getModel("detail").setProperty("/MATNR", oItem.Matnr);
        this.getModel("detail").setProperty("/KWMENG", oItem.Kwmeng);
        this.getModel("detail").setProperty("/VRKME", oItem.Vrkme);

      },

      onPressBack: async function () {

        const items = this.getModel("item").getProperty("/so_items");

        const oItem = items.find((i) => {
          return (
            i.Vbeln == this.getModel("detail").getProperty("/VBELN") &&
            i.Posnr == this.getModel("detail").getProperty("/POSNR")
          );
        });

        oItem.Kwmeng = this.getModel("detail").getProperty("/KWMENG");

        this.getModel("item").setProperty("/so_items", items);
        // this.getModel("home").setProperty("/SO", null);

        window.history.go(-1);
      }
    });
  }
);
