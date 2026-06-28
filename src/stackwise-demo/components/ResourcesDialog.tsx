import { useState } from 'react'
import { Button } from '@/stackwise-demo/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/stackwise-demo/components/ui/dialog'
import { Card } from '@/stackwise-demo/components/ui/card'
import { Book, FileText, Lightbulb } from 'lucide-react'

export function ResourcesDialog() {
  const [open, setOpen] = useState(false)

  const resources = [
    {
      category: 'User Guide',
      icon: Book,
      items: [
        { name: 'Getting Started with Stackwise', desc: 'Complete walkthrough of the platform' },
        { name: 'Strategy Studio Guide', desc: 'Building your quarterly marketing foundation' },
        { name: 'Pulse Hub Guide', desc: 'Understanding your performance metrics' },
        { name: 'Brand Craft Guide', desc: 'Creating consistent brand content' },
        { name: 'Flight Deck Guide', desc: 'Managing campaigns and execution' },
      ],
    },
    {
      category: 'Templates',
      icon: FileText,
      items: [
        { name: 'Quarterly Strategy Template', desc: 'Framework for quarterly planning' },
        { name: 'Campaign Brief Template', desc: 'Standard campaign planning document' },
        { name: 'Content Calendar Template', desc: 'Monthly content planning spreadsheet' },
        { name: 'Performance Report Template', desc: 'Executive summary reporting format' },
      ],
    },
    {
      category: 'Playbooks',
      icon: Lightbulb,
      items: [
        { name: 'ABM Playbook', desc: 'Account-based marketing best practices' },
        { name: 'Content Marketing Playbook', desc: 'Content strategy and execution guide' },
        { name: 'Demand Generation Playbook', desc: 'Lead generation and nurture strategies' },
        { name: 'Brand Voice Playbook', desc: 'Maintaining consistent messaging' },
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" data-testid="button-resources">
          <Book className="w-4 h-4" />
          <span>Resources</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Resources
          </DialogTitle>
          <DialogDescription>
            Access user guides, templates, and playbooks to maximize your Stackwise experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {resources.map((section, idx) => {
            const Icon = section.icon
            return (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">{section.category}</h3>
                </div>
                <div className="grid gap-2">
                  {section.items.map((item, itemIdx) => (
                    <Card
                      key={itemIdx}
                      className="p-3 hover-elevate cursor-pointer border"
                      data-testid={`resource-${idx}-${itemIdx}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          View
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Resources are currently in development. Full documentation, templates, and
            playbooks will be available soon.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
