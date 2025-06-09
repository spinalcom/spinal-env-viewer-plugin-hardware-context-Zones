const {
    SpinalContextApp
  } = require('spinal-env-viewer-context-menu-service');
  import { attributeService } from "spinal-env-viewer-plugin-documentation-service";
  import { SpinalGraphService } from "spinal-env-viewer-graph-service";
  import{removeRelationIfExist}from"./test.ts"

    export class RemoveNetworkTreeLink_zone extends SpinalContextApp {
      constructor() {
        super('Remove Network Tree Link', 'Spinal CDE description', {
          icon: 'delete',
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
             console.log("RemoveNetworkTreeLink action called");
              
              try {
            const NetworkGroupID = option.selectedNode.id.get();
            const gateways = await SpinalGraphService.getChildren(NetworkGroupID, "hasNetworkTreeBimObject");
      
            if (gateways.length > 0) {
              for (const gateway of gateways) {
                let realgat = SpinalGraphService.getRealNode(gateway.id.get());
      
                // Récupère les enfants des gateways
                let zones = await SpinalGraphService.getChildren(gateway.id.get(), "hasNetworkTreeGroup");
                 if(zones.length!=0){
                  for (const zone of zones) {
      
                    let realZone = SpinalGraphService.getRealNode(zone.id.get());
                    
                    let GrpNet = await SpinalGraphService.getChildren(zone.id.get(), "hasNetworkTreeGroup");
                    if(GrpNet.length != 0){
                      
                      for (const group of GrpNet) {
                        let realGroup = SpinalGraphService.getRealNode(group.id.get());
                        let bmschild = await SpinalGraphService.getChildren(group.id.get(), "hasBmsEndpoint");
                        if(bmschild.length != 0){
                          // supprimer les bms liés aux groupes
                          console.log("Removing BMS endpoint for Group:", group.name.get());
                          //await SpinalGraphService.removeChild(group.id.get(),bmschild[0].id.get(),"hasBmsEndPoint", "PtrLst", false);
                          await removeRelationIfExist(realGroup,"hasBmsEndpoint","PtrLst");
                        }
                        //supprimer le groupe
                        await SpinalGraphService.removeChild(zone.id.get(), group.id.get(), "hasNetworkTreeGroup", "PtrLst", false);
                        
                      }
                      //supprime relation zone -> group
                      await removeRelationIfExist(realZone, "hasNetworkTreeGroup", "PtrLst");

                      let bmsZone = await SpinalGraphService.getChildren(zone.id.get(), "hasBmsEndpoint");
                      if (bmsZone.length != 0) {
                        // supprimer les bms liés aux zones
                        console.log("Removing BMS endpoint for Zone:", zone.name.get());
                        //await SpinalGraphService.removeChild(zone.id.get(), bmsZone[0].id.get(), "hasBmsEndPoint", "PtrLst", false);
                        await removeRelationIfExist(realZone, "hasBmsEndpoint", "PtrLst");
                      }
                      await SpinalGraphService.removeChild(gateway.id.get(),zone.id.get(),"hasNetworkTreeGroup", "PtrLst", false);
                      
                    }
                    
                    
                  }
                  
                 }

                 let bmsgat = await SpinalGraphService.getChildren(gateway.id.get(), "hasBmsDevice");
                  if (bmsgat.length != 0) {
                    // supprimer les bms liés aux gateways
                    console.log("Removing BMS endpoint for Gateway:", gateway.name.get());
                    //await SpinalGraphService.removeChild(gateway.id.get(), bmsgat[0].id.get(), "hasBmsDevice", "PtrLst", false);
                    await removeRelationIfExist(realgat, "hasBmsDevice", "PtrLst");
                  }
                // Supprimer la gaeteway
                await SpinalGraphService.removeChild(NetworkGroupID, gateway.id.get(), "hasNetworkTreeBimObject", "PtrLst", false);
                
              }
              // Supprime les relations de l'étage vers gateways
            const networkNode = SpinalGraphService.getRealNode(NetworkGroupID);
            await removeRelationIfExist(networkNode, "hasNetworkTreeBimObject", "PtrLst");

            }
      
            
          } catch (e) {
            console.error("Error in action function:", e);
          }
        }
    
  
}