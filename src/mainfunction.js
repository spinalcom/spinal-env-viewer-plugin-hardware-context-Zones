
import { getFloorEquipments, getFloorPos, findEquForPosition, addPositionToNetwork, getequipments, getPositions, addEquipementsToPositon } from "./test";






/*export async function hardwarecontexteGeneration(PosContextName, PosCategoryName, GroupPositions, equContext, equCategory, GroupEquipement, distance,option) {

    const PositionContext = PosContextName;
    const PositionCategory = PosCategoryName;
    const GroupPos = GroupPositions;
    const EquipementsContext = equContext
    const EquipmentsCategory = equCategory
    const Groupequ = GroupEquipement;
    const distance_pos_lum = distance;


    const positionsList = await getPositions(PositionContext, PositionCategory, GroupPos);
    console.log("positionsList :",positionsList)

    const EquipmentsList = await getequipments(EquipementsContext, EquipmentsCategory, Groupequ);
    console.log("EquipmentsList",EquipmentsList)


    const EquipmentsByFloor = await getFloorEquipments(EquipmentsList, option.selectedNode.name.get());
     console.log("option selected node",option.selectedNode.name.get())

    console.log("EquipmentsByFloor",EquipmentsByFloor);

    const PositionbyFloor = await getFloorPos(positionsList, option.selectedNode.name.get());

    console.log("PositionbyFloor",PositionbyFloor);
     console.log("avant boucle")
    for (const pos of PositionbyFloor) {
      console.log("in loop") 
        try {
           
           
          await addPositionToNetwork(pos.Position, option);
      
          const list = findEquForPosition(pos, EquipmentsByFloor, distance_pos_lum);
          console.log("Equipments found for position:", list);
          
         if (list !== undefined) {
            await addEquipementsToPositon(list, pos.Position, option);
            console.log("adding equipment list to position",pos.Position.name.get())
          } else {
            console.log(
              "No equipment found for position",
              pos.Position.name ? pos.Position.name.get() : "Unknown Position"
            );
          }
        } catch (error) {
          console.error("Error processing position:", pos.Position.name?.get(), error);
        }
      }
      
}*/

