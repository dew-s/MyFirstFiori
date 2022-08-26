sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
  function (BaseController, JSONModel, MessageToast) {
    "use strict";

    return BaseController.extend("sap.nexus.zdewmo.controller.Item", {
      onInit: function () {
        this.oRouter = this.getRouter();
        this.oRouter.attachRouteMatched(this.afterMatched, this);

        this.setModel(
          new JSONModel({
            busy: false,
            delay: 0,
          }),
          "item"
        );
      },


      afterMatched: async function (oEvent) {

        if (oEvent.getParameter("name") == "item") {

          const oSaleOrderNo = this.getModel("home").getProperty("/SO");
          const oChkItem = this.getModel("item").getProperty("/so_items");

          if (!oChkItem) {
            const oFilters = new Array();
            const oFilter = new sap.ui.model.Filter({
              path: "Vbeln",
              operator: sap.ui.model.FilterOperator.EQ,
              value1: oSaleOrderNo,
            });

            oFilters.push(oFilter);


            const oResponse = await new Promise((resolve, reject) => {
              this.getModel().read("/LIST_SO_ITEM", {
                filters: [oFilters],
                success: (data) => resolve(data.results),
                error: (err) => reject(err)
              });
            });

            this.getModel("item").setProperty("/so_items", oResponse);
          }


        }
      },


      onListItemPress: function (oEvent) {

        MessageToast.show("Pressed : " + oEvent.getSource().getTitle());
        // console.log(oEvent.getSource());

        const oCustomData = {};
        const aCustomData = oEvent.getSource().getAggregation("customData");

        for (const oCustom of aCustomData) {
          oCustomData[oCustom.getProperty("key")] = oCustom.getProperty("value");
        }


        this.oRouter.navTo("detail", {
          vbeln: oCustomData.vbeln,
          posnr: oCustomData.posnr
        }, false
        );
      },



      onPressUpdate: async function () {
        const updItems = this.getModel("item").getProperty("/so_items")
          .map((i) => {
            return {
              Vbeln: i.Vbeln,
              Posnr: i.Posnr,
              Matnr: i.Matnr,
              Kwmeng: i.Kwmeng,
              Vrkme: i.Vrkme,
            };
          });



        const oBody = {
          Vbeln: this.getModel("home").getProperty("/SO"),
          Items: updItems,
        };

        const response = await new Promise((resolve, reject) => {
          this.getModel().create("/LIST_SO_HEAD", oBody, {
            success: (data) => resolve(data),
            error: (err) => reject(err),
          });
        });

        

      },

    });
  }
);
