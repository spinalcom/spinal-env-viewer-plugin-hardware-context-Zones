const {
  SpinalContextApp
} = require('spinal-env-viewer-context-menu-service');
import { attributeService } from "spinal-env-viewer-plugin-documentation-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";


const {
  spinalPanelManagerService,
} = require("spinal-env-viewer-panel-manager-service");

export class CreatNetworkTreeLink_zones extends SpinalContextApp {
  constructor() {
    super('Generate Hradware context Zones', 'Spinal CDE description', {
      icon: 'lightbulb',
      icon_type: 'in',
      backgroundColor: '#356BAB',
      fontColor: '#FFFFFF',
    });
  }

  async isShown(option) {
    if (option.selectedNode.type.get() !== "network")
      return -1;
    const context = option.context;
    const contextNode = SpinalGraphService.getRealNode(context.id.get());
    const attributes = await attributeService.getAttrBySchema(contextNode, {
      "Hardware Context": ["Hardware Context Type"]
    });
    if (attributes["Hardware Context"]?.["Hardware Context Type"] !== "zone")
      return -1;
    return true;
  }


  async action(option) {

    spinalPanelManagerService.openPanel("CreateNetworkTreezone", option);
}
}