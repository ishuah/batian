/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import {
  BASE_URL, HEADERS, getMaps, getMap, getSites,
} from '../API';
import { MapObject, LayerObject, Site } from '../views/Map/Map.types';

jest.mock('axios');

beforeEach(() => {
  // @ts-ignore
  axios.get.mockClear();
});

describe('getMaps', () => {
  test('when API call is successful it should return a list of maps', async () => {
    const mockRawMapsResponse = {
      meta: {
        limit: 20,
        next: null,
        offset: 0,
        previous: null,
        total: 1,
      },
      objects: [
        {
          description: 'City and town points, from Tokyo to Wasilla, Cairo to Kandahar',
          id: 1,
          layers: [
            {
              data_key: 'pop_max',
              id: 1,
              name: 'Cities',
              resource_uri: '/api/v1/layer/1/',
            },
          ],
          name: 'Populated Places',
          resource_uri: '/api/v1/map/1/',
        },
      ],
    };

    const mockMapsResponse = mockRawMapsResponse.objects as unknown as MapObject[];

    // @ts-ignore
    axios.get.mockResolvedValueOnce({ data: mockRawMapsResponse });
    const response = await getMaps();

    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/map`, { headers: HEADERS });
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response).toEqual(mockMapsResponse);
  });
});

describe('getMap', () => {
  test('when API call is successful it should return map details', async () => {
    const mockRawMapResponse = {
      description: 'City and town points, from Tokyo to Wasilla, Cairo to Kandahar',
      id: 1,
      layers: [
        {
          data_key: 'pop_max',
          id: 1,
          name: 'Cities',
          resource_uri: '/api/v1/layer/1/',
        },
      ],
      name: 'Populated Places',
      resource_uri: '/api/v1/map/1/',
    };

    const mockMapResponse = mockRawMapResponse as unknown as MapObject;

    // @ts-ignore
    axios.get.mockResolvedValueOnce({ data: mockRawMapResponse });
    const response = await getMap('1');

    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/map/1`, { headers: HEADERS });
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response).toEqual(mockMapResponse);
  });
});

describe('getSites', () => {
  test('when API call is successful it should return layer sites', async () => {
    const mockRawSiteResponse = {
      meta: {
        limit: 20,
        next: '/api/v1/site/?&layer=1&limit=3&offset=3',
        offset: 0,
        previous: null,
        total_count: 3,
      },
      objects: [
        {
          data: {
            pop_max: 21714,
          },
          id: 1,
          name: 'Colonia del Sacramento',
          resource_uri: '/api/v1/site/1/',
          shapes: [
            {
              content_object: '/api/v1/site/1/',
              id: 1,
              object_id: 1,
              resource_uri: '',
              shape: {
                coordinates: [
                  -57.8361160044964,
                  -34.4697877166029,
                ],
                type: 'Point',
              },
            },
          ],
        },
        {
          data: {
            pop_max: 21093,
          },
          id: 2,
          name: 'Trinidad',
          resource_uri: '/api/v1/site/2/',
          shapes: [
            {
              content_object: '/api/v1/site/2/',
              id: 2,
              object_id: 2,
              resource_uri: '',
              shape: {
                coordinates: [
                  -56.9009966,
                  -33.5439989,
                ],
                type: 'Point',
              },
            },
          ],
        },
        {
          data: {
            pop_max: 23279,
          },
          id: 3,
          name: 'Fray Bentos',
          resource_uri: '/api/v1/site/3/',
          shapes: [
            {
              content_object: '/api/v1/site/3/',
              id: 3,
              object_id: 3,
              resource_uri: '',
              shape: {
                coordinates: [
                  -58.3039975,
                  -33.138999,
                ],
                type: 'Point',
              },
            },
          ],
        },
      ],
    };

    const mockRawSiteResponseDefault = {
      meta: {
        limit: 3,
        next: '',
        offset: 3,
        previous: '/api/v1/site/?username=web-client&api_key=2751c89da102ccb4d042a6ddf4a0ef7296b5119d&layer=1&limit=3&offset=0',
        total_count: 7342,
      },
      objects: [
        {
          data: {
            pop_max: 19698,
          },
          id: 4,
          name: 'Canelones',
          resource_uri: '/api/v1/site/4/',
          shapes: [
            {
              content_object: '/api/v1/site/4/',
              id: 4,
              object_id: 4,
              resource_uri: '',
              shape: {
                coordinates: [
                  -56.2840015,
                  -34.538004,
                ],
                type: 'Point',
              },
            },
          ],
        },
        {
          data: {
            pop_max: 32234,
          },
          id: 5,
          name: 'Florida',
          resource_uri: '/api/v1/site/5/',
          shapes: [
            {
              content_object: '/api/v1/site/5/',
              id: 5,
              object_id: 5,
              resource_uri: '',
              shape: {
                coordinates: [
                  -56.2149984,
                  -34.099002,
                ],
                type: 'Point',
              },
            },
          ],
        },
        {
          data: {
            pop_max: 61845,
          },
          id: 6,
          name: 'Bassar',
          resource_uri: '/api/v1/site/6/',
          shapes: [
            {
              content_object: '/api/v1/site/6/',
              id: 6,
              object_id: 6,
              resource_uri: '',
              shape: {
                coordinates: [
                  0.7890036,
                  9.2610001,
                ],
                type: 'Point',
              },
            },
          ],
        },
      ],
    };

    const mockSiteResponse = {
      id: 1,
      sites: [...mockRawSiteResponse.objects as unknown as Site[],
        ...mockRawSiteResponseDefault.objects as unknown as Site[]],
    } as unknown as LayerObject;
    // @ts-ignore
    axios.get.mockResolvedValue({ data: mockRawSiteResponseDefault })
      .mockResolvedValueOnce({ data: mockRawSiteResponse });

    const response = await getSites({ id: 1, sites: [] } as unknown as LayerObject, 3, 1);

    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/site/?limit=3&offset=0&layer=1`, { headers: HEADERS });
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(response).toEqual(mockSiteResponse);
  });
});
