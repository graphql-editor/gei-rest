import { FieldResolveInput } from 'stucco-js';
import { getResolverData } from './gei/gei.js';
import { resolverFor } from './zeus/index.js';
import fetch from 'node-fetch';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Query', 'restProxy', async (args) => {
    const { data } = getResolverData<{ headers?: string[]; url: string; body?: string; method?: string }>(input);
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

    const response = await fetch(url.value, {
      headers: headersComputed,
      method: method.value,
      ...(body?.value ? { body: body.value } : {}),
    });

    return response.json();
  })(input.arguments);
