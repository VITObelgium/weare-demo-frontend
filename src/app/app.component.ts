import { Component } from '@angular/core';
import { GenericStore, NestedRedirectUrl, RDF_TYPE, SUR_SURVEYDATASET } from '@weare/weare-libs';
import { environment } from 'src/environments/environment';
import { BackendService } from './services/backend.service';
import { HttpClient } from '@angular/common/http';
import { DataFactory, Store } from "n3";
import { firstValueFrom } from 'rxjs';

export const CONFIG_BACKEND_TO_CHOOSE_OIDC_ISSUER = "BackendToChooseOidcIssuer";
export const CONFIG_QUERY_PARAM_OIDC_ISSUER_URL = "idp";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'demo-weare-fe';
  relativeResourceUrl: string = "demo/example_survey";
  firstPod: string | undefined;

  constructor(
    private backendService: BackendService,
    private http: HttpClient,
  ) {

  }

  authenticate() {
    console.log("Triggered authentication");

    const redirectUrl = window.document.location.href;
    const nestedRedirectUrl = new NestedRedirectUrl(`${environment.weare_backend_base}${environment.weare_backend_login}`);
    nestedRedirectUrl.addParam(CONFIG_QUERY_PARAM_OIDC_ISSUER_URL, CONFIG_BACKEND_TO_CHOOSE_OIDC_ISSUER);
    nestedRedirectUrl.push(`${environment.backend_base}${environment.backend_login}`);
    nestedRedirectUrl.push(redirectUrl);
    nestedRedirectUrl.navigate();
  }

  async readData() {
    console.log("Triggered read data");
    // Reading data from pod. For this demo we are reading the address information of a person in RDF format.

    //Create a datastore
    /*const dataStore = new GenericStore();
    dataStore.initializeByStore([new N3Store()]);
    */
   
    const pods = await firstValueFrom(this.backendService.getPods());

    console.log(pods);
    if (pods.length > 0) {
      this.firstPod = pods[0];
    } else {
      const message = `No Pods where found for the logged in user.`;
      console.log(message)
      throw Error(message)
    }
    //location to store the data
    const resource = await firstValueFrom(this.backendService.getResource(this.relativeResourceUrl));

    console.log(resource);

  }

  async writeData() {
    console.log("Triggered write data");


    //Create a datastore
    const pods = await firstValueFrom(this.backendService.getPods());

    console.log(pods);
    if (pods.length > 0) {
      this.firstPod = pods[0];
    } else {
      const message = `No Pods where found for the logged in user.`;
      console.log(message)
      throw Error(message)
    }
    //location to store the data
    const surveyStore = new Store();

    const dataLocation = `${this.firstPod}${this.relativeResourceUrl}`;
    //  this.n3Store.addQuad(new Quad(new NamedNode(expandedSubject), new NamedNode(expandedPredicate), DataFactory.literal(expandedObject)));
    // this.n3Store.addQuad(new Quad(new NamedNode(expandedSubject), new NamedNode(expandedPredicate), DataFactory.namedNode(expandedObject)));

    surveyStore.addQuads([
      DataFactory.quad( DataFactory.namedNode(dataLocation), RDF_TYPE, SUR_SURVEYDATASET),]);
    /*, {
      subject: `${dataLocation}#_answer${this.sanitize(question.name)}`,
      predicate: "rdf:type",
      object: "bbct_c:Answer"
    }, {
      subject: `${dataLocation}#_answer${this.sanitize(question.name)}`,
      predicate: "bbct_c:hasValue",
      object: value
    }, {
      subject: `${dataLocation}#_answer${this.sanitize(question.name)}`,
      predicate: "bbct_c:toQuestion",
      object: question.name
    }, {
      subject: dataLocation,
      predicate: "bbct_c:hasAnswer",
      object: `${dataLocation}#_answer${this.sanitize(question.name)}`
    }]);
    */
    const result = await this.backendService.writeResource(this.relativeResourceUrl, surveyStore );
    try {
      const response = await firstValueFrom(result);
      console.debug(`Response from writing updated answer to user's Pod [${JSON.stringify(response)}]`);
    } catch (err: any) {
      const message = `Error writing updated answer to user's Pod [${err.status}:${err.statusText}]. Error: ${err.error}`;
      console.error(message);
      throw new Error(message);
    }
  }

  shareData() {
    console.log("Triggered share data");
    this.backendService.shareResource(this.relativeResourceUrl!, "https://utils.prem-acc.vito.be/data/instance/vpp/questionnaire/prem/questionnaire-vpp-prem#_premQuestionnaire") // TODO
  }

}