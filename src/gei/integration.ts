type IntegrationData = {
  name: string;
  description: string;
  value: string | string[];
  required?: boolean;
};

type IntegrationSpecification = {
  [resolver: string]: {
    name: string;
    description: string;
    data: Record<string, IntegrationData>;
    resolve: { name: string };
  };
};

// Declare your resolver specifications here to generate JSON from it later using `gei integrate` command
const integration: IntegrationSpecification = {
  ['Query.restProxy']: {
    name: 'Proxy',
    description: 'Proxy your rest endpoint to GraphQL Schema',
    data: {
      headers: {
        name: 'Request headers',
        description: 'Insert request headers for REST',
        value: [],
      },
      body: {
        name: 'REST endpoint body',
        description: 'REST endpoint body serialized as JSON.',
        value: '',
      },
      url: {
        name: 'REST endpoint',
        description: 'REST endpoint to map to. Accepts values with $ at the beginning from the GraphQL Query.',
        value: '',
        required: true,
      },
      method: {
        name: 'method',
        description: 'GET, POST, PUT etc.',
        value: 'GET',
      },
    },
    resolve: {
      name: 'lib/rest',
    },
  },
};

export default integration;
