const {
  SpinalContextApp
} = require('spinal-env-viewer-context-menu-service');
import { attributeService } from "spinal-env-viewer-plugin-documentation-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { SITE_RELATION, BUILDING_RELATION, FLOOR_RELATION, FLOOR_TYPE } from "spinal-env-viewer-context-geographic-service";
import { NetworkTreeService } from "spinal-env-viewer-plugin-network-tree-service";
import { FindBimGateways, FindBMSGateways, matchBIMandBMSGateways,getZones,getBUSList,getZoneAttribute,getBUSList,getGrpInfo,searchGrpsForZone,addNetworkTypeNode,addNetworkTypeZone} from "./test";
import{Gatway_BIM_Context, Gatway_Bms_Context} from "../.config.json"

const {
  spinalPanelManagerService,
} = require("spinal-env-viewer-panel-manager-service");

export class CreatNetworkTreeLink_zones extends SpinalContextApp {
  constructor() {
    super('Generate Hradware context', 'Spinal CDE description', {
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
    const bimGateways = await FindBimGateways(
      Gatway_BIM_Context.ContextName,
      Gatway_BIM_Context.CategoryName,
      Gatway_BIM_Context.GroupeName
    );
  
    const bmsGateways = await FindBMSGateways(
      Gatway_Bms_Context.ContextOPCUA,
      Gatway_Bms_Context.OrganName,
      Gatway_Bms_Context.NetworkName
    );
  
    const matchedGateways = await matchBIMandBMSGateways(
      bimGateways,
      bmsGateways,
      option.selectedNode.name.get()
    );
  
    console.log("Matched Gateways:", matchedGateways);
  
    if (matchedGateways.length > 0) {
      await addMatchedGatewaysToTree(option, matchedGateways);
    } else {
      console.log("No matched Gateways found in floor.");
    }
  }
}
  async function addMatchedGatewaysToTree(option, matchedGateways) {
    const selectedNode = SpinalGraphService.getRealNode(option.selectedNode.id.get());
    const contextNode = SpinalGraphService.getRealNode(option.context.id.get());
    
    const gatewayNodes = await selectedNode.getChildrenInContext(contextNode);
    const existingGatewayNames = gatewayNodes.map(node => node.name.get());
  
    for (const gateway of matchedGateways) {
      if (!existingGatewayNames.includes(gateway.bim.name.get())) {
        try {
          console.log("Adding gateway :", gateway.bim.name.get());
          const addedBimNode = await SpinalGraphService.addChildInContext(
            option.selectedNode.id.get(),
            gateway.bim.id.get(),
            option.context.id.get(),
            "hasNetworkTreeBimObject",
            "PtrLst"
          );
  
          if (addedBimNode) {
            console.log("BIM Gateway added to Network Tree:", gateway.bim.name.get());
            
            let bmsrealnode =  SpinalGraphService.getRealNode(gateway.bms.id.get());
            await addedBimNode.addChild(
              
              bmsrealnode,
              "hasBmsDevice",
              "PtrLst"
            );
  
            // Call processZonesAndGroups
            await processZonesAndGroups(addedBimNode, gateway.bms, option.context.id.get());
          } else {
            console.warn("Failed to add BIM Gateway to Network Tree:", gateway.bim.name.get());
          }
        } catch (error) {
          console.error("Error while processing gateway:", gateway.bim.name.get(), error);
        }
      }
    }
  }
  
  async function processZonesAndGroups(addedBimNode, bmsNode, contextId) {
    try {
      const zones = await getZones(bmsNode);
      console.log("Zones:", zones);
  
      const busList = await getBUSList(bmsNode);
      console.log("BUS List:", busList);
  
      // Fetch group information once to avoid redundant calls
      const grpInfo = await getGrpInfo(busList);
  
      for (const zone of zones) {
        const createdZoneNode = await addNetworkTypeZone(
          addedBimNode.info.id.get(),
          contextId,
          zone.name.get(),
          "hasNetworkTreeGroup",
          "PtrLst"
        );
  
        if (!createdZoneNode) {
          console.warn(`Failed to create node for zone: ${zone.name.get()}`);
          continue;
        }
  
        try {
          const realZoneNode = SpinalGraphService.getRealNode(zone.id.get());
          createdZoneNode.addChild(realZoneNode, "hasBmsEndpoint", "PtrLst");
  
          const matchingGroups = await searchGrpsForZone(zone, grpInfo);
  
          for (const group of matchingGroups) {
            const createdGroupNode = await addNetworkTypeNode(
              createdZoneNode.info.id.get(),
              contextId,
              group.name.get(),
              "hasNetworkTreeGroup",
              "PtrLst"
            );
  
            if (createdGroupNode) {
              const realGroupNode = SpinalGraphService.getRealNode(group.id.get());
              createdGroupNode.addChild(realGroupNode, "hasBmsEndpoint", "PtrLst");
            } else {
              console.warn(`Failed to create node for group: ${group.name.get()}`);
            }
          }
  
          if (matchingGroups.length === 0) {
            console.log(`No matching groups found for zone: ${zone.name.get()}`);
          }
  
        } catch (error) {
          console.error(`Error while processing zone: ${zone.name.get()}`, error);
        }
      }
    } catch (error) {
      console.error("Error while processing zones and groups:", error);
    }
  }
  
  
  
