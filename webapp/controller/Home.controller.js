sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/ValueState"],
  function (BaseController, JSONModel, ValueState) {
    "use strict";

    return BaseController.extend("sap.nexus.zdewmo.controller.Home", {
      onInit: function () {
        this.oRouter = this.getRouter();

        this.setModel(
          new JSONModel({
            busy: false,
            delay: 0,
          }),
          "home"
        );

        // this.byId("grDateInput").setDateValue(new Date());
      },

      onPressNext: function () {
        const salesOrder = this.byId('soInput').getValue().trim();

        this.getModel("home").setProperty(
          "/SO",
          salesOrder
        );

        if (salesOrder) {
          console.log("I am before go to item");
          this.oRouter.navTo("item");
        } else {
          
        }

      },

      onLiveChange: async function (oEvent) {
        // console.log("onLiveChange");

        this.getModel("home").setProperty("/f4_so_list", null);
        const sInput = oEvent.getSource().getValue().trim();

        if (sInput) {
          const oFilters = new Array();

          const oFilter = new sap.ui.model.Filter({
            path: "Vbeln",
            operator: sap.ui.model.FilterOperator.StartsWith,
            value1: sInput,
          });

          oFilters.push(oFilter);

          const oResponse = await new Promise((resolve, reject) => {
            this.getModel().read("/F4_SO", {
              filters: [oFilters],
              success: (data) => resolve(data.results),
              error: (err) => reject(err)
            });
          });

          console.log(oResponse);
          this.getModel("home").setProperty("/f4_so_list", oResponse);
        }


        // console.log(this.getModel("home")).getProperty("/busy");
      }
    });
  }
);
