import {PanelCtrl} from "grafana/app/plugins/sdk";
import {Network, SingleValue} from "./JsonManager";

import _ = require("lodash");

export class JsImportPanel extends PanelCtrl {
  public static templateUrl: string = "panels/import-json-panel/partials/panelTemplate.html";
  public static scrollable: boolean = true;

  public panelDefaults = {
    jsonContent: "",
  };
  // Tests strings
  public message: string;
  public result: string;

  // Form
  public node_name: string;
  public observe_value: string;
  public samples: number = 1000;
  // loaded network
  public loaded_network: Network;

  constructor($scope, $injector) {
    super($scope, $injector);
    _.defaults(this.panel, this.panelDefaults);

    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
  }

  public onInitEditMode() {
    this.addEditorTab("JSON-Import-or-edit",
      "public/plugins/jsbayes-app/panels/import-json-panel/partials/optionTab_importEditJson.html",
      1);
    this.addEditorTab("Graphic-Network-Editor",
      "public/plugins/jsbayes-app/panels/import-json-panel/partials/optionTab_GraphicEditor.html",
      2);
    this.addEditorTab("Network-Connection-to-Grafana",
      "public/plugins/jsbayes-app/panels/import-json-panel/partials/optionTab_ConnectNetwork.html",
      3);
  }

  public onUpload(net) {
    console.log("On upload");
    try {
      this.loaded_network = new Network(JSON.stringify(net));
    } catch (e) {
      this.message = "Upload fallito!";
      this.result = "Errore nella lettura del JSON, probabilmente non valido...";
      return;
    }
    this.message = "Upload riuscito con successo!";
    this.result = "Rete pronta!";
    this.panel.jsonContent = JSON.stringify(net);
  }

  public onSubmit() { // Currently not used
    console.log("onSubmit() called");
    console.log("Node name:" + this.node_name);
    console.log("observe value:" + this.observe_value);
    console.log("Samples:" + this.samples);
    this.message = "Calculating...";
    this.loaded_network.observe(this.node_name, new SingleValue(this.observe_value, "0"));
    const sample_promise = this.loaded_network.sample(this.samples);
    const this_ref = this;
    let sample_result = -1;
    sample_promise.then(function (result) {
      sample_result = result / this_ref.samples;
      console.log(sample_result);
      this_ref.result = "Samples calculation done!";
      alert("Sample result:" + result / this_ref.samples);
    });
    this.message = "Done!";
    console.log("Out-Done");
  }

  public link(scope, element) {
  }
}