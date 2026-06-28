import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui-replit/card";
import { Button } from "./components/ui-replit/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ThreeColumnLayout } from "./components/ui-replit/three-column-layout";

export default function AnalyticsKPIs() {
  const [currentStep, setCurrentStep] = useState('analytics');
  const moduleColor = '#6218df';

  const leftNav = (
    <div className="p-6">
      <h2 className="text-lg font-bold" style={{ color: moduleColor }}>
        Pulse Hub
      </h2>
    </div>
  );

  const steps = [
    { id: 'analytics', label: 'Analytics & Intelligence', description: 'Performance metrics and KPIs' },
  ];

  const renderContent = () => {
    if (currentStep === 'analytics') {
      return (
        <div className="h-full overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto p-8 space-y-12">
            {/* Business Goals */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: moduleColor }}>Business Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Pipeline Growth', 'SQL Volume', 'Conversion Efficiency'].map((goal, i) => (
                  <Card key={i} className="border border-gray-200 shadow-sm" data-testid={`card-goal-${i}`}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold text-gray-800">{goal}</CardTitle>
                        <span className="text-green-600 font-semibold">▲ +8%</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold" style={{ color: moduleColor }}>+12%</p>
                      <p className="text-sm text-gray-500 mb-1">vs last 30 days</p>
                      <p className="text-sm italic text-gray-600">AI Insight: Efficiency gains driven by reallocated paid media and content refresh.</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Visibility + Performance */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: moduleColor }}>Visibility + Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  {label:'Sessions',value:'12,450',trend:'+9%',color:'text-green-600'},
                  {label:'Visitors',value:'9,880',trend:'+6%',color:'text-green-600'},
                  {label:'Pageviews',value:'37,200',trend:'+11%',color:'text-green-600'},
                  {label:'Avg. Time on Site',value:'2m 14s',trend:'-3%',color:'text-red-500'}
                ].map((metric,i)=>(
                  <div key={i} className="p-4 border border-gray-200 rounded-md" data-testid={`metric-visibility-${i}`}>
                    <p className="text-2xl font-bold" style={{ color: moduleColor }}>{metric.value}</p>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className={`text-xs font-semibold ${metric.color}`}>{metric.trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Indicators */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: moduleColor }}>Engagement Indicators</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  {label:'CTR',value:'3.4%',trend:'-2%',color:'text-red-500'},
                  {label:'Engagement Rate',value:'6.1%',trend:'+5%',color:'text-green-600'},
                  {label:'Form Fills',value:'420',trend:'+9%',color:'text-green-600'},
                  {label:'Returning Visitors',value:'44%',trend:'+3%',color:'text-green-600'}
                ].map((metric,i)=>(
                  <div key={i} className="p-4 border border-gray-200 rounded-md" data-testid={`metric-engagement-${i}`}>
                    <p className="text-2xl font-bold" style={{ color: moduleColor }}>{metric.value}</p>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className={`text-xs font-semibold ${metric.color}`}>{metric.trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Web Traffic Overview */}
            <div>
              <div className="flex justify-end space-x-3 mb-3">
                {['7D', '14D', '30D', 'MoM', 'QoQ', 'YoY'].map((filter, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    className="text-xs border-gray-300 text-gray-700"
                    style={{ 
                      '--hover-color': moduleColor,
                      borderColor: 'rgb(209, 213, 219)'
                    }}
                    data-testid={`filter-${filter}`}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: moduleColor }}>Web Traffic Overview</h3>
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={[
                      {name:'Week 1',visits:4000,unique:3000},
                      {name:'Week 2',visits:5200,unique:3900},
                      {name:'Week 3',visits:6100,unique:4500},
                      {name:'Week 4',visits:7200,unique:5600}
                    ]}> 
                      <XAxis dataKey="name"/>
                      <YAxis/>
                      <Tooltip/>
                      <Line type="monotone" dataKey="visits" stroke={moduleColor} strokeWidth={2}/>
                      <Line type="monotone" dataKey="unique" stroke="#c009ba" strokeWidth={2}/>
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Lead Quality & Pipeline Health */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: moduleColor }}>Lead Quality & Pipeline Health</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  {label:'Lead Quality Score',value:'8.2/10',trend:'+5%',color:'text-green-600'},
                  {label:'# Leads → Opps',value:'72%',trend:'+3%',color:'text-green-600'},
                  {label:'Opportunity Creation Rate',value:'28%',trend:'-1%',color:'text-yellow-500'},
                  {label:'Cost per SQL',value:'$142',trend:'-12%',color:'text-green-600'}
                ].map((metric,i)=>(
                  <div key={i} className="p-4 border border-gray-200 rounded-md" data-testid={`metric-pipeline-${i}`}>
                    <p className="text-2xl font-bold" style={{ color: moduleColor }}>{metric.value}</p>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className={`text-xs font-semibold ${metric.color}`}>{metric.trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Engagements */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: moduleColor }}>Campaign Engagements</h3>
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      {name:'Email',value:85},
                      {name:'Social',value:68},
                      {name:'Paid',value:54},
                      {name:'Content',value:92}
                    ]}> 
                      <XAxis dataKey="name"/>
                      <YAxis/>
                      <Tooltip/>
                      <Bar dataKey="value" fill={moduleColor} radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm mt-3 text-gray-600">AI: Email and content campaigns outperform in engagement rate. Social engagement stable, Paid declining — refine creative on underperforming ads.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ThreeColumnLayout
      leftNav={leftNav}
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={renderContent()}
      moduleColor={moduleColor}
      completedSteps={[]}
      featureName="Analytics & Intelligence"
    />
  );
}

