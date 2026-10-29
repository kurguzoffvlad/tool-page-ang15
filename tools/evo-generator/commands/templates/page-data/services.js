// commands/templates/page-data/services.js

const getRequestServiceTemplate = (className) => `import { Injectable } from '@angular/core';

import { IParams } from '../../service/interface/params.interface';

@Injectable({
    providedIn: 'root'
})
export class ${className} {
    public start(): IParams {
        return { search: { search: [] }, size: 200 };
    }
}
`;

const getServerServiceTemplate = (className) => `import { Injectable } from '@angular/core';

import { RestService } from '../../service/rest.service';
import { IParams } from '../../service/interface/params.interface';

@Injectable({
    providedIn: 'root'
})
export class ${className} {
    public constructor(
        public rest: RestService,
    ) {}

    public async start(params: IParams): Promise<any> {
        return await evo.awaitTryCatch.send(this.rest.search('catalogueRegions', params), 'AppComponent');
    }
}
`;

const getParsedServiceTemplate = (className) => `import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ${className} {
    public start(serverResult: any): any {
        return serverResult;
    }
}
`;

const getFactoryServiceTemplate = (className) => `import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ${className} {
    public start(parsedResult: any): any {
        const items = parsedResult.content.map((item: any) => ({
            id: item._id,
            code: item.code,
            name: item.name
        }));



        return items;
    }
}
`;


module.exports = {
    getRequestServiceTemplate,
    getServerServiceTemplate,
    getParsedServiceTemplate,
    getFactoryServiceTemplate
};
