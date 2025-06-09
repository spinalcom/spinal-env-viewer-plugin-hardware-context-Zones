<template>
  <div class="my-test-panel-container">
    <!-- Gateway section -->
    <div class="Gateway-section">
      <h3>Gateway</h3>
      <md-field>
        <label>Context Name</label>
        <md-input v-model="GatewayContextName" placeholder="Context name"></md-input>
      </md-field>

      <md-field>
        <label>Category Name</label>
        <md-input v-model="GatewayCategoryName" placeholder="Category name"></md-input>
      </md-field>

      <md-field>
        <label>Group Name</label>
        <md-input v-model="GatewayGroupName" placeholder="Group name"></md-input>
      </md-field>
    </div>

    <!-- OPCUA Network section -->
    <div class="Network-section">
      <h3>OPCUA Network</h3>
      <md-field>
        <label>Network Context OPCUA</label>
        <md-input v-model="ContextNetworkName" placeholder="Network Context name"></md-input>
      </md-field>

      <md-field>
        <label>Network Organ OPCUA</label>
        <md-input v-model="OrganNetworkName" placeholder="Organ name"></md-input>
      </md-field>

      <md-field>
        <label>Network</label>
        <md-input v-model="NetworkName" placeholder="Network name"></md-input>
      </md-field>
    </div>

    <!-- Confirm Button -->
    <md-button @click="onConfim" :disabled="btnDisabled">Confirm</md-button>

    <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
  </div>
</template>

<script>
import{hardwareGeneration} from "./mainfunction";
export default {
  name: "CreateNetworkTreezone",
  data() {
    return {
      loading: false,
      GatewayContextName: "Gestion des équipements",
      GatewayCategoryName: "Network",
      GatewayGroupName: "DALI-OPC",
      ContextNetworkName: "OPCUA Réseau",
      OrganNetworkName: "spinal-organ-opcua-dev-2",
      NetworkName: "WBOX3",
    };
  },
  methods: {
    async onConfim() {
      console.log("onConfim");
      this.loading = true;
      try {
        // Code to create the network here
        await hardwareGeneration(
               
                
               this.GatewayContextName,
               this.GatewayCategoryName,
               this.GatewayGroupName,

               this.ContextNetworkName,
               this.OrganNetworkName,
               this.NetworkName,

               this.option
           );

      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    opened(option, viewer) {
      console.log("opened option", option);
      console.log("opened viewer", viewer);
      this.option = option;
      this.viewer = viewer;
    },
    removed(option, viewer) {
      console.log("removed option", option);
      console.log("removed viewer", viewer);
    },
    closed(option, viewer) {
      console.log("closed option", option);
      console.log("closed viewer", viewer);
    },
    openDialog() {
      console.log("openDialog");

    }
  },
  computed: {
    btnDisabled() {
      return ![
        this.GatewayContextName,
        this.GatewayCategoryName,
        this.GatewayGroupName,
        this.ContextNetworkName,
        this.OrganNetworkName,
        this.NetworkName
      ].every(field => field !== "");
    },
  },
};
</script>

<style>
.my-test-panel-container {
  padding: 15px;
}

.Gateway-section, .Network-section {
  margin-bottom: 15px;
}

.Gateway-section h3, .Network-section h3 {
  margin-bottom: 10px;
}
</style>
