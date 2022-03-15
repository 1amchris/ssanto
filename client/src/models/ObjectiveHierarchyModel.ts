import objectivesData from './objectives.json';
import FormSelectOptionModel from './form-models/FormSelectOptionModel';

export default class ObjectiveHierarchyModel {
  data;
  main: string;

  constructor(objectiveHierarchyData: {
    main: string;
    primaries: {
      primary: string[];
      secondaries: {
        secondary: string[];
        attributes: { attribute: string[]; dataset: string[] }[];
      }[];
    };
  }) {
    this.data = objectiveHierarchyData;
    this.main = objectiveHierarchyData.main;
  }

  primaryName(index: number): string {
    return this.data.primaries.primary[index];
  }

  secondaryName(primaryIndex: number, secondaryIndex: number): string {
    return this.data.primaries.secondaries[primaryIndex].secondary[
      secondaryIndex
    ];
  }

  getPrimary(): string[] {
    return this.data.primaries.primary;
  }

  getSecondary(primaryIndex: number): string[] {
    return this.data.primaries.secondaries[primaryIndex].secondary;
  }

  getAttribute(primaryIndex: number, secondaryIndex: number): string[] {
    return this.data.primaries.secondaries[primaryIndex].attributes[
      secondaryIndex
    ].attribute;
  }

  getAllMainOptions = () => {
    let options: string[] = [];
    objectivesData?.mains.map((json: { main: string }) => {
      options.push(json.main);
    });
    return options;
  };

  getAllPrimaryOptions = (main: string) => {
    let options: string[] = [];

    objectivesData.mains.map(json => {
      if (json.main == main) {
        json.primaries?.map(json => {
          options.push(json.primary);
        });
      }
    });
    return options;
  };

  getAllSecondaryOptions = (primary: string) => {
    let options: string[] = [];
    objectivesData?.mains[0]?.primaries?.map(json => {
      if (json.primary == primary) {
        json.secondaries.map(json => {
          options.push(json.secondary);
        });
      }
    });
    return options;
  };

  getAllAttributesOptions = (primary: string, secondary: string) => {
    var options: string[] = [];
    objectivesData?.mains[0]?.primaries?.map(json => {
      if (json.primary == primary) {
        json.secondaries.map(json => {
          if (json.secondary == secondary) {
            json.attributes.map(json => {
              options.push(json.attribute);
            });
          }
        });
      }
    });
    return options;
  };

  formatOptions(options: string[]): FormSelectOptionModel[] {
    return options.map(
      main =>
        ({
          value: `${main}`,
          label: `${main}`,
        } as FormSelectOptionModel)
    );
  }

  generateOptionsMain(): FormSelectOptionModel[] {
    let options = [this.data.main];
    this.getAllMainOptions().map(main => {
      if (main != this.data.main) options.push(main);
    });
    return this.formatOptions(options);
  }

  generateOptionsPrimary(primaryIndex: number): FormSelectOptionModel[] {
    //include the selected primary objectif
    let options = [this.data.primaries.primary[primaryIndex]];

    //Add unused primary objectives
    this.getAllPrimaryOptions(this.main).map(primary => {
      if (!this.data.primaries.primary.includes(primary)) options.push(primary);
    });
    return this.formatOptions(options);
  }

  generateOptionsSecondary(
    primaryIndex: number,
    secondaryIndex: number
  ): FormSelectOptionModel[] {
    //include the selected primary objectif
    let options = [
      this.data.primaries.secondaries[primaryIndex].secondary[secondaryIndex],
    ];

    //Add unused secondary objectives
    this.getAllSecondaryOptions(this.primaryName(primaryIndex)).map(
      secondary => {
        if (
          !this.data.primaries.secondaries[primaryIndex].secondary.includes(
            secondary
          )
        )
          options.push(secondary);
      }
    );
    return this.formatOptions(options);
  }

  generateOptionsAttribute(
    primaryIndex: number,
    secondaryIndex: number,
    attributeIndex: number
  ): FormSelectOptionModel[] {
    //include the selected primary objectif
    let options = [
      this.data.primaries.secondaries[primaryIndex].attributes[secondaryIndex]
        .attribute[attributeIndex],
    ];

    //Add unused secondary objectives
    this.getAllAttributesOptions(
      this.primaryName(primaryIndex),
      this.secondaryName(primaryIndex, secondaryIndex)
    ).map(attribute => {
      if (
        !this.data.primaries.secondaries[primaryIndex].attributes[
          secondaryIndex
        ].attribute.includes(attribute)
      )
        options.push(attribute);
    });
    return this.formatOptions(options);
  }

  onAddPrimary(): void {}
}
