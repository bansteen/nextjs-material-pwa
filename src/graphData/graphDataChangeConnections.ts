import { Node, Edge } from 'vis-network';

export interface TimeFrameData {
  timeFrame: string;
  nodes: Node[];
  edges: Edge[];
}

export interface ServerResponseItem {
  week?:string;//weekly response has week instead of date/month
  date?: { value: string };
  month?: { value: string };//some response has month instead of date
  source: string;
  source_name: string;
  target: string;
  target_name: string;
  weight: number;
  sum_coin?: number;//some response has sum_coin instead of weight
}

interface TransformedNode {
  color: string;
  font: { color: string };
  id: string;
  label: string;
  shape: string;
  size: number;
}

interface TransformedEdge {
  arrows: string;
  from: string;
  to: string;
  width: number;
}

interface TransformedData {
  timeFrame: string;
  nodes: TransformedNode[];
  edges: TransformedEdge[];
}

export function transformResponse(serverResponse: ServerResponseItem[],
                                  startDate: Date, 
                                  showName: boolean,
                                  userIds:string,
  ): TransformedData[] {
  console.log(userIds)
  const userIdArray = userIds.split(',');
  const transformedData: TransformedData[] = [];
  const groupedData: Record<string, ServerResponseItem[]> = {};
  // const weekGroups = getWeeklyGroups(startDate);
  // const firstEntry = serverResponse[0]
  // if(firstEntry) {
  //   if(!firstEntry.month){
  //     weekGroups.forEach(weekKey => {
  //       groupedData[weekKey]= []
  //     });  
  //   }
  // }
  
  serverResponse.forEach(entry => {

    if (entry.month) {
      const date = new Date(entry.month.value);
      // Handle monthly response
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!groupedData[monthKey]) {
        groupedData[monthKey] = [];
      }
      groupedData[monthKey].push(entry);
    } else if (entry.week) {
      const weekValue = entry.week; // Get the week value from the response
      // Find the index of the week value in weekGroups
      if (!groupedData[weekValue]) {
        groupedData[weekValue] = [];
      }
      groupedData[weekValue].push(entry);
    }
  });

  for (const key in groupedData) {
    const nodes: TransformedNode[] = [];
    const edges: TransformedEdge[] = [];

    groupedData[key].forEach(entry => {
      const nodeId = entry.source;
      const nodeLabel = showName?entry.source_name:entry.source
      const targetNodeId = entry.target;
      const targetLabel = showName?entry.target_name:entry.target
      // Check if weight or sum_coin is available and assign it accordingly
      const weightValue = entry.weight !== undefined ? entry.weight : entry.sum_coin || 1;
      let calculatedWeight = weightValue
      if(entry.weight !== undefined){
        calculatedWeight = 4 * Math.log(weightValue / 1000) + 1;
      } else {
        calculatedWeight = Math.log(weightValue) + 1;
      }
      // Check if the node with the same ID already exists
      if (!nodes.find(node => node.id === nodeId)) {
      const nodeMatchesUserId = userIdArray.includes(nodeId);
      const nodeColor = nodeMatchesUserId ? "#FFFF00" : "#1400FF"; // Change to yellow if it matches userIds
        nodes.push({
          color: nodeColor,
          font: { color: "#000000" },
          id: nodeId,
          label: nodeLabel,
          shape: "dot",
          size: 12
        });
      }
      if (!nodes.find(node => node.id === targetNodeId)) {

        const nodeMatchesUserId = userIdArray.includes(targetNodeId);
        const nodeColor = nodeMatchesUserId ? "#FFFF00" : "#1400FF"; // Change to yellow if it matches userIds
        nodes.push({
          color: nodeColor,
          font: { color: "#000000" },
          id: targetNodeId,
          label: targetLabel,
          shape: "dot",
          size: 12
        });
      }
      // Check if the edge with the same IDs already exists
      if (!edges.find(edge => edge.from === nodeId && edge.to === targetNodeId)) {
        edges.push({
          arrows: "to",
          from: nodeId,
          to: targetNodeId,
          width: calculatedWeight
        });
      }
    });

    transformedData.push({
      timeFrame: key,
      nodes: nodes,
      edges: edges
    });
  }

  return transformedData;
}


/*function getWeeklyGroups(startDate: Date): string[] {
  const weekGroups: string[] = [];
  const daysInWeek = 7;
  const weeksToGenerate = 5;

  const nextWeekStart = new Date(startDate);
  nextWeekStart.setDate(startDate.getDate() - 7)
  const weekEnd = new Date(startDate);
  weekEnd.setDate(startDate.getDate() - 1)
  for (let i = 0; i < weeksToGenerate; i++) {
    //console.log("startDate:" + nextWeekStart)
    //console.log("endDate:" + weekEnd)
    weekGroups.push(getWeekRange(nextWeekStart, weekEnd));
    nextWeekStart.setDate(nextWeekStart.getDate() + daysInWeek); // Move to the next week start
    weekEnd.setDate(weekEnd.getDate() + daysInWeek);
  }
  
  return weekGroups;
}


function getWeekRange(startDate: Date, endDate:Date): string {
  return `${formatDate(startDate)} to ${formatDate(endDate)}`;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}*/
