import type { Node, Edge } from 'vis-network';


// Define additional sets if needed
interface CommunityData {
    nodes: Node[];
    edges: Edge[];
  }
  
  interface CommunityDataMap {
    [community: string]: CommunityData;
  }
  
  export const communityData: CommunityDataMap = {
    community1: {
      nodes: [
        {"color": "#97c2fc", "id": 732576, "label": "\u98a8\u559c(\u3075\u3046\u304d\ud83c\udf53)\ud83e\udd5e\ud83c\udfb8", "shape": "dot", "size": 12.979576003669171}, {"color": "#97c2fc", "id": 1782690, "label": "\u30ce\u30d0\u30d5\u30df\u30e4\ud83d\udc76\ud83c\udffb\ud83c\udfa4", "shape": "dot", "size": 12.349263685722216}, {"color": "#97c2fc", "id": 5208580, "label": "\ud83c\udf3b\u6a39\u91cc\ud83c\udf3b3\u5468\u5e74\ud83c\udf89", "shape": "dot", "size": 3.1290150749321373}, {"color": "#97c2fc", "id": 2578378, "label": "\u3057\u308d\ud83d\udc30\u0f72\u0f80", "shape": "dot", "size": 3.2800680965185367}, {"color": "#97c2fc", "id": 2807281, "label": "FUYU\u2716\ufe0f\ud83e\udd41\ud83d\ude80\ud83d\udde3", "shape": "dot", "size": 12.73281347289798}, {"color": "#97c2fc", "id": 2669105, "label": "\u3061\u3083\u3074\ud83e\uddad\u202a\u202a \ud80c\ude12\ud80c\udff8", "shape": "dot", "size": 8.398948618082136}, {"color": "#97c2fc", "id": 47089, "label": "\ud83d\udc7cairi\ud83d\udc7c\u2661 ", "shape": "dot", "size": 3.4887533059868776}, {"color": "#97c2fc", "id": 4004536, "label": "\ud83c\udf43\ud83c\udf3cYurry\ud83c\udf3c\ud83c\udf43", "shape": "dot", "size": 5.029547118662518}, {"color": "#97c2fc", "id": 6526586, "label": "\u304a\u3084\u30c1\u30b1\u3042\u304d\u3048\u3093\u3074\u3064\u270f\ufe0f\ud83e\udd5a", "shape": "dot", "size": 10.52475737309722}, {"color": "#97c2fc", "id": 1782872, "label": "\u80b2\u4f11\ud83d\udc76\ud83c\udffb\u3061\u308d\u308b\u3061\u3087\u3053\ud83d\udc9a \u266a\u030a\u0308\u266a\u0306\u0308", "shape": "dot", "size": 1.7039767246444233}, {"color": "#97c2fc", "id": 2719772, "label": "\u3042\u3044\u308a\u30fc\ud83c\udfa4\ud83d\udc08", "shape": "dot", "size": 13.976841608505092}, {"color": "#97c2fc", "id": 788063, "label": "Sharo\ud83d\udc30\ud83c\udf99\u2728", "shape": "dot", "size": 12.406438917281692}
      ],
      edges: [
        {"arrows": "to", "from": 4004536, "to": 732576}, {"arrows": "to", "from": 1782690, "to": 732576}, {"arrows": "to", "from": 2807281, "to": 732576}, {"arrows": "to", "from": 6526586, "to": 2807281}, {"arrows": "to", "from": 2669105, "to": 2807281}, {"arrows": "to", "from": 1782690, "to": 2669105}, {"arrows": "to", "from": 2669105, "to": 1782690}, {"arrows": "to", "from": 732576, "to": 1782690}, {"arrows": "to", "from": 1782690, "to": 2807281}, {"arrows": "to", "from": 788063, "to": 6526586}, {"arrows": "to", "from": 732576, "to": 6526586}, {"arrows": "to", "from": 1782690, "to": 6526586}, {"arrows": "to", "from": 2719772, "to": 6526586}, {"arrows": "to", "from": 2669105, "to": 2719772}, {"arrows": "to", "from": 2719772, "to": 2807281}, {"arrows": "to", "from": 2719772, "to": 788063}, {"arrows": "to", "from": 1782690, "to": 788063}, {"arrows": "to", "from": 6526586, "to": 788063}, {"arrows": "to", "from": 732576, "to": 788063}, {"arrows": "to", "from": 788063, "to": 2719772}, {"arrows": "to", "from": 732576, "to": 2578378}, {"arrows": "to", "from": 2807281, "to": 788063}, {"arrows": "to", "from": 2669105, "to": 47089}, {"arrows": "to", "from": 788063, "to": 1782690}, {"arrows": "to", "from": 2719772, "to": 2669105}, {"arrows": "to", "from": 732576, "to": 4004536}, {"arrows": "to", "from": 732576, "to": 2719772}, {"arrows": "to", "from": 4004536, "to": 5208580}, {"arrows": "to", "from": 47089, "to": 2669105}, {"arrows": "to", "from": 4004536, "to": 2807281}, {"arrows": "to", "from": 2719772, "to": 732576}, {"arrows": "to", "from": 1782872, "to": 2807281}, {"arrows": "to", "from": 732576, "to": 2807281}, {"arrows": "to", "from": 1782872, "to": 732576}, {"arrows": "to", "from": 2719772, "to": 1782690}, {"arrows": "to", "from": 6526586, "to": 1782690}, {"arrows": "to", "from": 6526586, "to": 732576}, {"arrows": "to", "from": 1782690, "to": 4004536}, {"arrows": "to", "from": 6526586, "to": 2719772}, {"arrows": "to", "from": 2807281, "to": 2719772}
      ],
    },
    community2: {
      nodes: [
        {"color": "#97c2fc", "id": 830434, "label": "\ud83c\udf9f.\u00b7\u307f\u3044\u3328\ud83d\ude3d\u0f80\u0f72\ud83d\udc97", "shape": "dot", "size": 3.3228969337312155}, {"color": "#97c2fc", "id": 1367204, "label": "\u3042\u307f\u305f\u3093\ud83e\udd84\u0ed2\ua4b1\u00b7", "shape": "dot", "size": 3.3228969337312155}, {"color": "#97c2fc", "id": 4024327, "label": "\ud83d\udc9c\ud83d\udc31\u3086\u3044\u3053\u308d\ud83d\udc31\ud83d\udc9c", "shape": "dot", "size": 35.91100169673837}, {"color": "#97c2fc", "id": 4783850, "label": "\u3053\u304225\u4eba\ud81a\udc0b\u3044\u304f\u307f\u3093\u25e1\u0308\ud81a\udc1a\u0eca", "shape": "dot", "size": 10.953984794288118}, {"color": "#97c2fc", "id": 2521613, "label": "\u30e9\u30b8\u30aa\u30cf\u30e0\ud83d\udc37", "shape": "dot", "size": 10.95398479428812}, {"color": "#97c2fc", "id": 5769169, "label": "\u30ad\u30ea\u30b3\u30a2\u6c42\ud83c\udf34\u308a\u3093\u305f\u308d\u30fc\ud83c\udf7b", "shape": "dot", "size": 13.627265258646734}, {"color": "#97c2fc", "id": 89752, "label": "\ud83d\udc23\ud83c\udf80\u5927\u9ce5\u512a\u5b50\ud83d\udc23\ud83c\udf80\u611b\u9ce5\u9031\u9593\u611f\u8b1d\ud83d\udc23\ud83d\udc93", "shape": "dot", "size": 10.95398479428812}, {"color": "#97c2fc", "id": 1083068, "label": "\u269c\ufe0f\u3048\u308a\u30fc\ud83e\udd0d", "shape": "dot", "size": 10.95398479428812}
      ],
      edges: [
        {"arrows": "to", "from": 4783850, "to": 5769169}, {"arrows": "to", "from": 830434, "to": 5769169}, {"arrows": "to", "from": 4024327, "to": 2521613}, {"arrows": "to", "from": 4783850, "to": 4024327}, {"arrows": "to", "from": 4024327, "to": 4783850}, {"arrows": "to", "from": 1367204, "to": 5769169}, {"arrows": "to", "from": 4024327, "to": 1083068}, {"arrows": "to", "from": 89752, "to": 4024327}, {"arrows": "to", "from": 2521613, "to": 4024327}, {"arrows": "to", "from": 1083068, "to": 4024327}, {"arrows": "to", "from": 4024327, "to": 89752}
      ],
    },
    community3: {
      nodes: [
        {"color": "#97c2fc", "id": 1593296, "label": "\u307f\u304f\u308d \ud81a\udc0b\u2764\ufe0e ", "shape": "dot", "size": 24.138513513513516}, {"color": "#97c2fc", "id": 4538514, "label": "\ud83d\udea6\u5065\u8a3a\u884c\u304b\u306a\u304d\u3083.\u3068\u3046\u304b\u308a\u3093.\ud83c\udf51\ud83d\udc8e\ud83d\udc23", "shape": "dot", "size": 24.138513513513512}, {"color": "#97c2fc", "id": 1196584, "label": "\u306f\u308b\u304b\ud83d\udc25", "shape": "dot", "size": 3.7500000000000013}, {"color": "#97c2fc", "id": 143348, "label": "\ud83e\udd53(\u6771\u5317)\u5343\u77f3\u3089\u3059\u304b\u308b\u3002\u3001", "shape": "dot", "size": 47.97297297297297}
      ],
      edges: [
        {"arrows": "to", "from": 4538514, "to": 143348}, {"arrows": "to", "from": 143348, "to": 1593296}, {"arrows": "to", "from": 1593296, "to": 143348}, {"arrows": "to", "from": 143348, "to": 4538514}, {"arrows": "to", "from": 1196584, "to": 143348}
      ],
    },
    // Add more communities as needed
  };