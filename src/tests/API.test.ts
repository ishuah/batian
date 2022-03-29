import axios from "axios";
import { getMaps } from "../API";
import { MapObject } from "../views/Map/Map.types";

jest.mock("axios");

describe("getMaps", () => {
  describe("when API call is successful", () => {
    it("should return a list of maps", async () => {
      const mockRawMapsResponse = {
        "meta": {
          "limit": 20,
          "next": null,
          "offset": 0,
          "previous": null,
          "total_count": 1
        },
        "objects": [
          {
            "description": "City and town points, from Tokyo to Wasilla, Cairo to Kandahar",
            "id": 1,
            "layers": [
              {
                "data_key": "pop_max",
                "id": 1,
                "name": "Cities",
                "resource_uri": "/api/v1/layer/1/"
              }
            ],
            "name": "Populated Places",
            "resource_uri": "/api/v1/map/1/"
          }
        ]
      };

      const mockMapsResponse = mockRawMapsResponse["objects"] as unknown as MapObject[];

      // @ts-ignore
      axios.get.mockResolvedValueOnce({ data: mockRawMapsResponse});
      const response = await getMaps();

      expect(axios.get).toHaveBeenCalled();
      expect(response).toEqual(mockMapsResponse);
    })
  })
})