import WY from '../data/Wyoming.json'
import MT from '../data/Montana.json'
import ND from '../data/NorthDakota.json'
import ev from '../data/espace_vert.json'
import ts from '../data/terrain_sport_ext.json'

let check_instance: LayerService | null=null;

export class LayerService {
    
    layers={}
    activeLayers = {
        "espace_vert": [45.509, -73.553], 
        "terrain_sport_ext": [45.539, -73.573],
        //"T": [45.599, -73.673],
        //"r": [[51.49, -0.08], [51.5, -0.06]]
    }
    
    

    constructor() {
        if (!check_instance) {
          check_instance=this;
          this.importLayers()
      }      
    else
       {
        return check_instance;
  }};


    importLayers(){
        /*Object.assign(this.layers, {espace_vert: ev, terrain_sport_ext: ts});*/
        console.log(ev)
        console.log(ts)
        //Object.assign(this.layers, {"espace_vert": [-73.6162282707, 45.4568074973], "terrain_sport_ext": [-73.6122399274, 45.5611545652]});
    };

    cleanLayers(){
        this.layers=[]
    }

}
