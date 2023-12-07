import { ResponsivePie } from "@nivo/pie";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyResponsivePie() {
  const navigate = useNavigate();
  const [performanceData, setPerformanceData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const transformDriverData = (data) => {
    const transformedData = [];
    if (data) {
      for (const uid in data) {
        if (data.hasOwnProperty(uid)) {
          const userData = data[uid];

          const mappedData = {
            performance: userData.performance,
          };

          transformedData.push(mappedData);
        }
      }
    }

    return transformedData;
  };
  const fetchSpeedRecord = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-SpeedRecord`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  const [grades, setGrades] = useState([]);

  const calculatePerformanceScore = (
    averageSpeed,
    harshBraking,
    suddenAcceleration
  ) => {
    const minMaxNormalize = (value, min, max) => {
      return (value - min) / (max - min);
    };

    const minAverageSpeed = 0;
    const maxAverageSpeed = 80;

    const minHarshBraking = 0;
    const maxHarshBraking = 10;
    const minSuddenAcceleration = 0;
    const maxSuddenAcceleration = 10;

    const normalizedAverageSpeed = minMaxNormalize(
      averageSpeed,
      minAverageSpeed,
      maxAverageSpeed
    );
    const normalizedHarshBraking = minMaxNormalize(
      harshBraking,
      minHarshBraking,
      maxHarshBraking
    );
    const normalizedSuddenAcceleration = minMaxNormalize(
      suddenAcceleration,
      minSuddenAcceleration,
      maxSuddenAcceleration
    );

    const weightedAverageSpeed = normalizedAverageSpeed * 0.3;
    const weightedHarshBraking = (1 - normalizedHarshBraking) * 0.3;
    const weightedSuddenAcceleration = (1 - normalizedSuddenAcceleration) * 0.4;

    const normalizedScore =
      weightedAverageSpeed + weightedHarshBraking + weightedSuddenAcceleration;

    return normalizedScore;
  };

  const getGrading = (normalizedScore) => {
    if (normalizedScore >= 0.8 && normalizedScore <= 1.0) {
      return "Excellent";
    } else if (normalizedScore > 0.6 && normalizedScore < 0.8) {
      return "Good";
    } else if (normalizedScore >= 0.4 && normalizedScore < 0.6) {
      return "Average";
    } else if (normalizedScore >= 0.2 && normalizedScore < 0.4) {
      return "Needs Improvement";
    } else {
      return "Invalid Score";
    }
  };

  const calculateGrades = (data) => {
    const grades = {
      excellent: 0,
      good: 0,
      average: 0,
      needsImprovement: 0,
    };

    for (const uid in data) {
      if (data.hasOwnProperty(uid)) {
        const idData = data[uid];
        const numRecords = Object.keys(idData).length;

        if (numRecords > 0) {
          let totalNormalizedScore = 0;

          for (const id in idData) {
            if (idData.hasOwnProperty(id)) {
              const record = idData[id];

              const normalizedScore = calculatePerformanceScore(
                record.average_speed,
                record.harsh_braking_count,
                record.sudden_acceleration_count
              );

              totalNormalizedScore += normalizedScore;
            }
          }

          const averageNormalizedScore = totalNormalizedScore / numRecords;

          const grading = getGrading(averageNormalizedScore);

          switch (grading) {
            case "Excellent":
              grades.excellent++;
              break;
            case "Good":
              grades.good++;
              break;
            case "Average":
              grades.average++;
              break;
            case "Needs Improvement":
              grades.needsImprovement++;
              break;
            default:
              break;
          }
        }
      }
    }

    return grades;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSpeedRecord();

        const grades = calculateGrades(data);
        setGrades(grades);
        console.log("Grades:", grades);
      } catch (error) {
        console.error("Error fetching and calculating averages:", error);
      }
    };
    fetchData();
  }, []);

  const countPerformanceRanges = (data) => {
    const count = {
      excellent: 0,
      good: 0,
      average: 0,
      needsImprovement: 0,
    };

    data.forEach((item) => {
      const performanceValue = parseFloat(item.performance);

      if (!isNaN(performanceValue)) {
        if (performanceValue >= 1.0 && performanceValue <= 1.25) {
          count.excellent++;
        } else if (performanceValue > 1.25 && performanceValue <= 1.5) {
          count.good++;
        } else if (performanceValue > 1.5 && performanceValue <= 1.75) {
          count.average++;
        } else if (performanceValue > 1.75 && performanceValue <= 2.0) {
          count.needsImprovement++;
        }
      }
    });

    return count;
  };

  const fetchDriverInformation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetch-driver`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSpeedRecord();

        const gradesCount = calculateGrades(data);

        const dynamicChartData = [
          {
            id: "Excellent",
            label: "Excellent",
            value: gradesCount.excellent,
            color: "hsl(70, 70%, 50%)",
          },
          {
            id: "Good",
            label: "Good",
            value: gradesCount.good,
            color: "hsl(329, 70%, 50%)",
          },
          {
            id: "Average",
            label: "Average",
            value: gradesCount.average,
            color: "hsl(189, 70%, 50%)",
          },
          {
            id: "Needs Improvement",
            label: "Needs Improvement",
            value: gradesCount.needsImprovement,
            color: "hsl(214, 70%, 50%)",
          },
        ];

        setChartData(dynamicChartData);
      } catch (error) {
        console.error("Error fetching and transforming data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <ResponsivePie
      data={chartData}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "Excellent",
          },
          id: "dots",
        },
        {
          match: {
            id: "Good",
          },
          id: "dots",
        },
        {
          match: {
            id: "Average",
          },
          id: "dots",
        },
        {
          match: {
            id: "Needs Improvement",
          },
          id: "lines",
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 10,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
}

export default MyResponsivePie;
