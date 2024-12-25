const {
  SpinalContextApp
} = require('spinal-env-viewer-context-menu-service');
import { attributeService } from "spinal-env-viewer-plugin-documentation-service"
import { SpinalGraphService } from "spinal-env-viewer-graph-service"
import { SITE_RELATION, BUILDING_RELATION, FLOOR_RELATION, FLOOR_TYPE } from "spinal-env-viewer-context-geographic-service"
import { NetworkTreeService } from "spinal-env-viewer-plugin-network-tree-service"

export class GenerateFloorBtn_zones extends SpinalContextApp {
  constructor() {
    super('Generate Floor Network', 'Spinal CDE description', {
      icon: 'account_tree',
      icon_type: 'in',
      backgroundColor: '#356BAB',
      fontColor: '#FFFFFF',
      
    });
  }

  async isShown(option) {
    if (option.selectedNode.type.get() !== "networkTreeContext")
      return -1;
    const selectedNode = SpinalGraphService.getRealNode(option.selectedNode.id.get())
    const attributes = await attributeService.getAttrBySchema(selectedNode, {
      "Hardware Context": ["Hardware Context Type"]
    })
    if (attributes["Hardware Context"]?.["Hardware Context Type"] !== "zone")
      return -1;
    return true;
  }


  async action(option) {
    const contexts = await option.graph.getChildren();
    const contextSpatial = contexts.find((itm) => itm.info.name.get() === "spatial")
    if (!contextSpatial) throw "context spatial not found";
    const floors = await contextSpatial.find([SITE_RELATION, BUILDING_RELATION, FLOOR_RELATION], (node) => {
      return node.info.type.get() === FLOOR_TYPE
    })
    const selectedNode = SpinalGraphService.getRealNode(option.selectedNode.id.get())
    const contextNode = SpinalGraphService.getRealNode(option.context.id.get())
    const networks = await selectedNode.getChildrenInContext(contextNode)
    const networkNames = networks.map(node => node.info.name.get())
    for (const floor of floors) {
      if (!networkNames.includes(floor.info.name.get()))
        await NetworkTreeService.addNetwork(floor.info.name.get(),
          selectedNode.info.id.get(), option.context.id.get())
    }
  }
}