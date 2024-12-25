const SideBarHookName = 'GraphManagerSideBar';
const {
    spinalContextMenuService,
} = require('spinal-env-viewer-context-menu-service');
import {CreatNetworkTreeLink_zones} from "./CreatNetworkTreeLink_zones.js";
import {GenerateFloorBtn_zones} from "./GenerateFloorBtn_zones.js";
import {RemoveNetworkTreeLink} from "./RemoveNetworkTreeLink.js";
const {
    SpinalForgeExtention
  } = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");


  
spinalContextMenuService.registerApp(
    SideBarHookName,
    new GenerateFloorBtn_zones(), [7]
);

spinalContextMenuService.registerApp(
    SideBarHookName,
    new CreatNetworkTreeLink_zones(), [7]
);

spinalContextMenuService.registerApp(
    SideBarHookName,
    new RemoveNetworkTreeLink(), [7])


