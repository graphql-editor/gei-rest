import { FieldResolveInput } from 'stucco-js';
import { getResolverData } from './gei/gei.js';
import { resolverFor } from './zeus/index.js';
import fetch from 'node-fetch';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Query', 'restProxy', async (args) => {
    const { data } = getResolverData<{
      headers?: string[];
      url: string;
      body?: string;
      method?: string;
      passedHeaders?: string[];
    }>(input);
    if (!data) {
      throw new Error('Invalid resolver data');
    }
    const { url, body, headers, method = { value: 'GET' } } = data;

    const inputs = input.arguments;
    if (inputs) {
      Object.keys(inputs).forEach((inputName) => {
        url.value = url.value.replace(`\$${inputName}`, inputs[inputName] + '');
        if (body) body.value = body.value?.replace(`\$${inputName}`, inputs[inputName] + '');
      });
    }

    const headersComputed =
      headers?.value?.map((v) => v.split(':')).reduce((a, b) => ({ ...a, [b[0]]: b[1] }), {}) || {};
    const inputHeaders = input.protocol?.headers;
    const addHeaders = data.passedHeaders?.value
      ?.map((h) => {
        if (inputHeaders && inputHeaders[h]) {
          return { v: inputHeaders[h][0], k: h };
        }
      })
      .reduce<Record<string, string>>((a, b) => {
        if (!b) return a;
        return {
          ...a,
          [b.k]: b.v,
        };
      }, {});

    const response = await fetch(url.value, {
      headers: {
        ...headersComputed,
        ...addHeaders,
      },
      method: method.value,
      ...(body?.value ? { body: body.value } : {}),
    });

    return response.json();
  })(input.arguments);
