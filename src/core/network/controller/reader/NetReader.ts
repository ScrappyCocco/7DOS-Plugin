import { FluxResult } from "../../../../core/fluxReadResult/FluxResult";
import { FluxResults } from "../../../../core/fluxReadResult/FluxResults";
import {NodeAdapter} from "../../../../core/node/NodeAdapter";
import {InputFlux} from "./flux/InputFlux";

export class NetReader {
  private inputFlux: Map<NodeAdapter, InputFlux>;

  public constructor (nodeList: Array<NodeAdapter>) {
    for (const node of nodeList) {
      this.inputFlux.set(node, null);
    }
  }

  public read(): FluxResults {
    // TODO: Funzione di read per un NodeAdapter
  /*
    CICLO

      chiama client read
      mi ritorna il valore
      lo collego

    fine ciclo
*/
    return new FluxResults(new Array<FluxResult> (new FluxResult(null, "true")));
  }
}
