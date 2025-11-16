import { parse } from 'vue/compiler-sfc';

class inspectionHelper {
  constructor() {
    this.id = null;
    this.standards = Array(3).fill('');
    this.selectedLogic = null;
    this.logicCase = [
      {
        id: 1,
        standardLength: 1,
        inputType: 'button',
        standardString: () => {
          return `${this.standards[0]}`;
        },
        operators: [''],
        function: (value) => {
          return this.standards[0] == value;
        },
      },
      {
        id: 2,
        standardLength: 2,
        inputType: 'number',
        standardString: () => {
          return `${this.standards[0]} ~ ${this.standards[1]}`;
        },
        operators: ['', '~'],
        function: (value) => {
          const min = parseFloat(this.standards[0]);
          const max = parseFloat(this.standards[1]);
          const val = parseFloat(value);
          return val >= min && val <= max;
        },
      },
      {
        id: 3,
        standardLength: 1,
        inputType: 'number',
        standardString: () => {
          return `> ${this.standards[0]}`;
        },
        operators: ['>'],
        function: (value) => {
          return parseFloat(value) > parseFloat(this.standards[0]);
        },
      },
      {
        id: 4,
        standardLength: 1,
        inputType: 'number',
        standardString: () => {
          return `< ${this.standards[0]}`;
        },
        operators: ['<'],
        function: (value) => {
          return parseFloat(value) < parseFloat(this.standards[0]);
        },
      },
      {
        id: 5,
        standardLength: 3,
        inputType: 'number',
        operators: ['', '+', '-'],
        standardString: () => {
          return `${this.standards[0]}, + ${this.standards[1]}  -${this.standards[2]}`;
        },
        function: (value) => {
          const target = parseFloat(this.standards[0]);
          const min = parseFloat(this.standards[1]);
          const max = parseFloat(this.standards[2]);
          const val = parseFloat(value);
          return val >= target - min && val <= target + max;
        },
      },
      {
        id: 6,
        standardString: () => {
          return `>= ${this.standards[0]}`;
        },
        standardLength: 1,
        inputType: 'number',
        operators: ['>='],
        function: (value) => {
          return parseFloat(value) >= parseFloat(this.standards[0]);
        },
      },
      {
        id: 7,
        standardString: () => {
          return `<= ${this.standards[0]}`;
        },
        standardLength: 1,
        inputType: 'number',
        operators: ['<='],
        function: (value) => {
          return parseFloat(value) <= parseFloat(this.standards[0]);
        },
      },
      {
        id: 8,
        standardString: () => {
          return `${this.standards[0]}`;
        },
        standardLength: 1,
        inputType: 'text',
        operators: [''],
        function: (value) => {
          const val = value.toString().toLowerCase();
          const std = this.standards[0].toString().toLowerCase();
          return val == std;
        },
      },
      {
        id: 9,
        standardString: () => {
          return `${this.standards[0]}`;
        },
        standardLength: 1,
        inputType: 'number',
        operators: [''],
        function: (value) => {
          const val = parseFloat(value);
          const std = parseFloat(this.standards[0]);
          return val == std;
        },
      },
      {
        id: 10,
        standardString: () => {
          return `≠ ${this.standards[0]}`;
        },
        standardLength: 1,
        inputType: 'text',
        operators: ['≠'],
        function: (value) => {
          const val = value.toString().toLowerCase();
          const std = this.standards[0].toString().toLowerCase();
          return val != std;
        },
      },
      {
        id: 16,
        standardString: () => {
          return `${this.standards[0]}`;
        },
        standardLength: 1,
        inputType: 'button',
        operators: [''],
        function: (value) => {
          return this.standards[0] == value;
        },
      },
      {
        id: 17,
        standardLength: 1,
        inputType: 'number',
        operators: ['±'],
        standardString: () => {
          return `± ${this.standards[0]}`;
        },
        function: (value) => {
          const val = parseFloat(value);
          const std = parseFloat(this.standards[0]);
          const min = val - std;
          const max = val + std;
          return val >= min && val <= max;
        },
      },
    ];
    this.value = '';
  }
  setId(id) {
    this.id = id;
    this.selectedLogic = this.logicCase.find((lc) => lc.id == id);
    this.standards = Array(this.selectedLogic.standardLength).fill('');
    this.selectedLogic = this.logicCase.find((lc) => lc.id == id);
    if (id == 1) {
      this.standards[0] = 'OK';
    }
  }

  calculate(value) {
    return this.selectedLogic.function(value);
  }
  getStandardString() {}
}

export { inspectionHelper };
