const SideBarHookName = 'GraphManagerSideBar';
const {
    spinalContextMenuService,
} = require('spinal-env-viewer-context-menu-service');
import {CreatNetworkTreeLink_zones} from "./CreatNetworkTreeLink_zones.js";
import {GenerateFloorBtn_zones} from "./GenerateFloorBtn_zones.js";
import { RemoveNetworkTreeLink_zone } from "./RemoveNetworkTreeLink_zone.js";    

import Vue from 'vue';
import CreateNetworkTreezone from "./panel-create-network-tree-zone.vue";

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
    new RemoveNetworkTreeLink_zone(), [7]
);

SpinalForgeExtention.registerExtention('CreateNetworkTreezone', SpinalForgeExtention.createExtention({
    name: "CreateNetworkTreezone",
    // Vue.extend to create a Compoment constructor
    vueMountComponent: Vue.extend(CreateNetworkTreezone),
    // where to  append the Compoment
    parentContainer: document.body,
  
    panel: {
      title: "Generate Hardware Context",
      classname: "spinal-pannel",
      closeBehaviour: "delete"
    },
    style: {
      left: "405px",
      width: "700px",
      height: '250px'
    }
  }));


