"use client"

import { use, useCallback, useEffect, useState } from "react"
import type { MouseEvent as ReactMouseEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Save, Plus, X } from "lucide-react"
import { toast } from "sonner"

type MindmapNodeData = {
  label: string
  description?: string
}

type MindmapNode = Node<MindmapNodeData>

type MindmapEdge = Edge

export default function MindmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [nodes, setNodes, onNodesChange] = useNodesState<MindmapNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<MindmapEdge>([])
  const [mindmap, setMindmap] = useState<any>(null)
  const [selectedNode, setSelectedNode] = useState<MindmapNode | null>(null)
  const [showNodeDialog, setShowNodeDialog] = useState(false)
  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false)
  const [newNodeLabel, setNewNodeLabel] = useState("")
  const [newNodeDescription, setNewNodeDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data?.user) {
        router.push("/auth/login")
        return
      }

      if (id.startsWith("temp-")) {
        const storedData = sessionStorage.getItem(`mindmap-${id}`)
        if (storedData) {
          const mindmapData = JSON.parse(storedData)
          setMindmap(mindmapData)
          setNodes(mindmapData.nodes || [])
          setEdges(mindmapData.edges || [])
          setIsSaved(false)
          setLoading(false)
        } else {
          toast.error("Mindmap data not found")
          router.push("/dashboard")
        }
      } else {
        supabase
          .from("mindmaps")
          .select("*")
          .eq("id", id)
          .single()
          .then(({ data: mindmapData, error: mindmapError }) => {
            if (mindmapError || !mindmapData) {
              toast.error("Failed to load mindmap")
              router.push("/dashboard")
              return
            }

            setMindmap(mindmapData)
            setNodes(mindmapData.nodes || [])
            setEdges(mindmapData.edges || [])
            setIsSaved(true)
            setLoading(false)
          })
      }
    })
  }, [id, router])

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onNodeClick = useCallback((_event: ReactMouseEvent, node: Node) => {
    setSelectedNode(node as MindmapNode)
    setShowNodeDialog(true)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()

    try {
      if (isSaved && !id.startsWith("temp-")) {
        const { error } = await supabase
          .from("mindmaps")
          .update({
            nodes,
            edges,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)

        if (error) {
          toast.error("Failed to save mindmap")
        } else {
          toast.success("Mindmap saved successfully")
        }
      } else {
        const { data: newMindmap, error } = await supabase
          .from("mindmaps")
          .insert({
            user_id: mindmap.user_id,
            title: mindmap.title,
            content: mindmap.content,
            nodes,
            edges,
          })
          .select()
          .single()

        if (error) {
          toast.error("Failed to save mindmap")
        } else {
          toast.success("Mindmap saved successfully")
          setIsSaved(true)
          sessionStorage.removeItem(`mindmap-${id}`)
          router.push(`/mindmap/${newMindmap.id}`)
        }
      }
    } catch (error) {
      toast.error("Failed to save mindmap")
    } finally {
      setSaving(false)
    }
  }

  const handleAddNode = () => {
    if (!newNodeLabel.trim()) return

    const newNode: MindmapNode = {
      id: `node-${Date.now()}`,
      type: "default",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: newNodeLabel,
        description: newNodeDescription,
      },
    }

    setNodes((nds) => [...nds, newNode])
    setNewNodeLabel("")
    setNewNodeDescription("")
    setShowAddNodeDialog(false)
    toast.success("Node added successfully")
  }

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId))
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
    setShowNodeDialog(false)
    toast.success("Node deleted successfully")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading mindmap...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{mindmap?.title}</h1>
            <p className="text-muted-foreground">
              {isSaved ? "Saved mindmap" : "Unsaved mindmap - Click save to keep it"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddNodeDialog(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Node
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : isSaved ? "Update" : "Save"}
            </Button>
          </div>
        </div>

        <Card className="h-[600px]">
          <CardContent className="p-0 h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showNodeDialog} onOpenChange={setShowNodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNode?.data?.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedNode?.data?.description || "No description available"}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => selectedNode && handleDeleteNode(selectedNode.id)}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Delete Node
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddNodeDialog} onOpenChange={setShowAddNodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Node</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="node-label">Node Label</Label>
              <Input
                id="node-label"
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                placeholder="Enter node label"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="node-description">Description</Label>
              <Textarea
                id="node-description"
                value={newNodeDescription}
                onChange={(e) => setNewNodeDescription(e.target.value)}
                placeholder="Enter node description"
                className="mt-2"
              />
            </div>
            <Button onClick={handleAddNode} className="w-full">
              Add Node
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
