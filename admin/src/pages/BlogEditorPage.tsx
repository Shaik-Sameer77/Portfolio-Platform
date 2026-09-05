import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mermaid from 'mermaid';
import DOMPurify from 'isomorphic-dompurify';
import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { common, createLowlight } from 'lowlight';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Divider,
  IconButton,
  CircularProgress,
  Switch,
  FormControlLabel,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Autocomplete,
  Select,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Code as CodeIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatListBulleted as ListIcon,
  FormatListNumbered as NumberedListIcon,
  FormatQuote as QuoteIcon,
  InsertLink as LinkIcon,
  AddPhotoAlternate as ImageIcon,
  Preview as PreviewIcon,
  Add as AddIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  FormatUnderlined as UnderlineIcon,
  Highlight as HighlightIcon,
  TableChart as TableIcon,
} from '@mui/icons-material';
import api from '../api';
import ImageUpload from '../components/ImageUpload';

const lowlight = createLowlight(common);

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType
      unsetLineHeight: () => ReturnType
    }
  }
}

const LineHeight = Extension.create({
  name: 'lineHeight',
  addOptions() {
    return {
      types: ['paragraph', 'heading', 'listItem'],
      defaultLineHeight: 'normal',
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: (element: HTMLElement) => element.style.lineHeight || this.options.defaultLineHeight,
            renderHTML: (attributes: Record<string, any>) => {
              if (attributes.lineHeight === this.options.defaultLineHeight) {
                return {}
              }
              return { style: `line-height: ${attributes.lineHeight}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({ commands }: any) => {
        return this.options.types.every((type: string) => commands.updateAttributes(type, { lineHeight }))
      },
      unsetLineHeight: () => ({ commands }: any) => {
        return this.options.types.every((type: string) => commands.resetAttributes(type, 'lineHeight'))
      },
    }
  },
});

export default function BlogEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [content, setContent] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  
  // States for deferred uploading
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [pendingImages, setPendingImages] = useState<Map<string, File>>(new Map());

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'blog-image',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      LineHeight,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const fetchBlog = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await api.get(`/blog?all=true`);
      const blog = response.data.find((b: any) => b.id === parseInt(id));
      if (blog) {
        setTitle(blog.title);
        setSlug(blog.slug);
        setExcerpt(blog.excerpt || '');
        setCoverImage(blog.coverImage || '');
        setPublished(blog.published);
        setFeatured(blog.featured || false);
        setCategoryIds(blog.categories ? blog.categories.map((c: any) => c.id) : []);
        const html = blog.content;
        setContent(html);
        editor?.commands.setContent(html);
      }
    } catch (err) {
      console.error('Failed to fetch blog', err);
    } finally {
      setLoading(false);
    }
  }, [id, editor]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/blog/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (editor && id) {
      fetchBlog();
    }
  }, [editor, id, fetchBlog]);

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'dark' });
  }, []);

  // Render mermaid blocks in the live preview
  useEffect(() => {
    const renderMermaid = async () => {
      try {
        const previewEl = document.querySelector('.preview-content');
        if (!previewEl) return;
        
        const mermaidBlocks = previewEl.querySelectorAll('pre code.language-mermaid');
        
        for (let i = 0; i < mermaidBlocks.length; i++) {
          const block = mermaidBlocks[i];
          const pre = block.parentElement;
          if (!pre) continue;
          
          const code = block.textContent || '';
          const id = `mermaid-${Date.now()}-${i}`;
          
          try {
            const { svg } = await mermaid.render(id, code);
            const div = document.createElement('div');
            div.innerHTML = svg;
            div.className = 'mermaid-rendered';
            div.style.display = 'flex';
            div.style.justifyContent = 'center';
            div.style.margin = '2rem 0';
            
            // Replace the <pre> with the rendered SVG
            pre.parentNode?.replaceChild(div, pre);
          } catch (e) {
            console.error("Mermaid syntax error:", e);
            // Ignore syntax errors while typing
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    const timeoutId = setTimeout(renderMermaid, 150);
    return () => clearTimeout(timeoutId);
  }, [content]);

  const handleSave = async () => {
    if (!title || !editor) return;
    setSaving(true);
    try {
      let finalCoverImage = coverImage;
      let finalContent = content;

      // 1. Upload Cover Image if it's new
      if (coverImageFile) {
        // Local file
        const formData = new FormData();
        formData.append('file', coverImageFile);
        formData.append('folder', 'blogs');
        const uploadRes = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        finalCoverImage = uploadRes.data.url;
      } else if (finalCoverImage && finalCoverImage.startsWith('http') && !finalCoverImage.includes('cloudinary.com')) {
        // External URL
        const uploadRes = await api.post('/upload/url', { url: finalCoverImage, folder: 'blogs' });
        finalCoverImage = uploadRes.data.url;
      }

      // 2. Process TipTap content for blob URLs and external URLs
      const doc = new DOMParser().parseFromString(finalContent, 'text/html');
      const images = Array.from(doc.querySelectorAll('img'));
      
      for (const img of images) {
        const src = img.getAttribute('src');
        if (!src) continue;

        if (src.startsWith('blob:') && pendingImages.has(src)) {
          // Local blob
          const file = pendingImages.get(src)!;
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'blogs');
          
          const uploadRes = await api.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          
          img.setAttribute('src', uploadRes.data.url);
          img.classList.add('blog-image');
        } else if (src.startsWith('http') && !src.includes('cloudinary.com')) {
          // External URL
          try {
            const uploadRes = await api.post('/upload/url', { url: src, folder: 'blogs' });
            img.setAttribute('src', uploadRes.data.url);
            img.classList.add('blog-image');
          } catch (err) {
            console.warn('Failed to cloudinar-ize external image:', src);
            // Keep original src as fallback if Cloudinary upload fails
          }
        }
      }
      
      finalContent = doc.body.innerHTML;

      const data = {
        title,
        slug: slug || undefined,
        content: finalContent,
        excerpt,
        coverImage: finalCoverImage,
        published,
        featured,
        categoryIds,
      };

      if (id) {
        await api.patch(`/blog/${id}`, data);
      } else {
        await api.post('/blog', data);
      }
      navigate('/blogs');
    } catch (err) {
      console.error(err);
      alert('Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleEditorImageUpload = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
      setContent(editor.getHTML());
    }
    setImageDialogOpen(false);
  };

  const handleEditorImageSelect = (file: File, previewUrl: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: previewUrl }).run();
      setContent(editor.getHTML());
      setPendingImages(prev => new Map(prev).set(previewUrl, file));
    }
    setImageDialogOpen(false);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;
    try {
      setCreatingCategory(true);
      const response = await api.post('/blog/categories', { name: newCategoryName });
      const newCat = response.data;
      setCategories(prev => [...prev, newCat]);
      setCategoryIds(prev => [...prev, newCat.id]);
      setNewCategoryName('');
      setCategoryDialogOpen(false);
    } catch (err) {
      console.error('Failed to create category', err);
      alert('Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/blogs')}>
            <BackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {id ? 'Edit Blog' : 'Create New Blog'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={<Switch checked={featured} onChange={(e) => setFeatured(e.target.checked)} />}
            label={featured ? 'Featured' : 'Standard'}
          />
          <FormControlLabel
            control={<Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />}
            label={published ? 'Published' : 'Draft'}
          />
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{ borderRadius: '12px', px: 4, background: 'linear-gradient(135deg, #7c6af7, #6366f1)' }}
          >
            Save Post
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ flexGrow: 1, minHeight: 0 }}>
        {/* Left Side: Editor */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Paper sx={{ p: 3, borderRadius: '20px', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
              <TextField
                fullWidth
                label="Post Title"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="standard"
                slotProps={{ input: { sx: { fontSize: '1.5rem', fontWeight: 700 } } }}
              />
              <TextField
                fullWidth
                label="Custom Slug (optional)"
                placeholder="my-cool-post"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                size="small"
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Excerpt / Summary"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Autocomplete
                  multiple
                  options={categories}
                  getOptionLabel={(option) => option.name}
                  value={categories.filter(c => categoryIds.includes(c.id))}
                  onChange={(_, newValue) => {
                    setCategoryIds(newValue.map(v => v.id));
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="Categories" placeholder="Search categories..." />
                  )}
                />
                <IconButton 
                  color="primary" 
                  onClick={() => setCategoryDialogOpen(true)}
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: '10px' }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              
              <ImageUpload 
                label="Cover Image"
                folder="blogs"
                value={coverImage}
                deferred={true}
                onUploadSuccess={(url) => setCoverImage(url)}
                onFileSelect={(file, preview) => {
                  setCoverImage(preview);
                  setCoverImageFile(file);
                }}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Editor Toolbar */}
            <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 1, bgcolor: 'background.default', borderRadius: '8px', alignItems: 'center' }}>
              <Select
                size="small"
                value={editor?.getAttributes('textStyle').fontFamily || 'Inter'}
                onChange={(e) => editor?.chain().focus().setFontFamily(e.target.value).run()}
                sx={{ height: 30, fontSize: '0.8rem', mr: 1, minWidth: 100 }}
              >
                <MenuItem value="Inter">Inter</MenuItem>
                <MenuItem value="Comic Sans MS, Comic Sans">Comic Sans</MenuItem>
                <MenuItem value="serif">Serif</MenuItem>
                <MenuItem value="monospace">Monospace</MenuItem>
              </Select>
              
              <Select
                size="small"
                value={editor?.isActive('heading', { level: 1 }) ? 'h1' : editor?.isActive('heading', { level: 2 }) ? 'h2' : editor?.isActive('heading', { level: 3 }) ? 'h3' : 'p'}
                onChange={(e) => {
                  if (e.target.value === 'p') editor?.chain().focus().setParagraph().run();
                  else editor?.chain().focus().toggleHeading({ level: parseInt(e.target.value.replace('h', '')) as any }).run();
                }}
                sx={{ height: 30, fontSize: '0.8rem', mr: 1, minWidth: 100 }}
              >
                <MenuItem value="p">Paragraph</MenuItem>
                <MenuItem value="h1">Heading 1</MenuItem>
                <MenuItem value="h2">Heading 2</MenuItem>
                <MenuItem value="h3">Heading 3</MenuItem>
              </Select>

              <Select
                size="small"
                value={editor?.getAttributes('paragraph').lineHeight || editor?.getAttributes('heading').lineHeight || 'normal'}
                onChange={(e) => (editor?.chain().focus() as any).setLineHeight(e.target.value).run()}
                sx={{ height: 30, fontSize: '0.8rem', mr: 1, minWidth: 90 }}
              >
                <MenuItem value="normal">Auto Height</MenuItem>
                <MenuItem value="1">Height: 1.0</MenuItem>
                <MenuItem value="1.15">Height: 1.15</MenuItem>
                <MenuItem value="1.5">Height: 1.5</MenuItem>
                <MenuItem value="2">Height: 2.0</MenuItem>
                <MenuItem value="2.5">Height: 2.5</MenuItem>
              </Select>

              <input
                type="color"
                onInput={event => editor?.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                value={editor?.getAttributes('textStyle').color || '#ffffff'}
                style={{ height: '30px', width: '30px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                title="Text Color"
              />

              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

              <IconButton size="small" onClick={() => editor?.chain().focus().toggleBold().run()} color={editor?.isActive('bold') ? 'primary' : 'default'}>
                <BoldIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => editor?.chain().focus().toggleItalic().run()} color={editor?.isActive('italic') ? 'primary' : 'default'}>
                <ItalicIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => editor?.chain().focus().toggleUnderline().run()} color={editor?.isActive('underline') ? 'primary' : 'default'}>
                <UnderlineIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => editor?.chain().focus().toggleHighlight().run()} color={editor?.isActive('highlight') ? 'primary' : 'default'}>
                <HighlightIcon fontSize="small" />
              </IconButton>
              
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              
              <IconButton size="small" onClick={() => editor?.chain().focus().setTextAlign('left').run()} color={editor?.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}>
                <AlignLeftIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => editor?.chain().focus().setTextAlign('center').run()} color={editor?.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}>
                <AlignCenterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => editor?.chain().focus().setTextAlign('right').run()} color={editor?.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}>
                <AlignRightIcon fontSize="small" />
              </IconButton>

              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

              <IconButton size="small" onClick={() => editor?.chain().focus().toggleBulletList().run()} color={editor?.isActive('bulletList') ? 'primary' : 'default'}>
                <ListIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => editor?.chain().focus().toggleOrderedList().run()} color={editor?.isActive('orderedList') ? 'primary' : 'default'}>
                <NumberedListIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => editor?.chain().focus().toggleBlockquote().run()} color={editor?.isActive('blockquote') ? 'primary' : 'default'}>
                <QuoteIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => editor?.chain().focus().toggleCodeBlock().run()} color={editor?.isActive('codeBlock') ? 'primary' : 'default'}>
                <CodeIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={setLink} color={editor?.isActive('link') ? 'primary' : 'default'}>
                <LinkIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} color={editor?.isActive('table') ? 'primary' : 'default'}>
                <TableIcon fontSize="small" />
              </IconButton>
              
              <Box sx={{ flexGrow: 1 }} />
              <Button size="small" startIcon={<ImageIcon />} onClick={() => setImageDialogOpen(true)}>
                Img
              </Button>
            </Box>

            {editor?.isActive('table') && (
               <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 1, bgcolor: 'background.paper', borderRadius: '8px' }}>
                 <Button size="small" onClick={() => editor.chain().focus().addColumnBefore().run()}>Add Col Before</Button>
                 <Button size="small" onClick={() => editor.chain().focus().addColumnAfter().run()}>Add Col After</Button>
                 <Button size="small" onClick={() => editor.chain().focus().deleteColumn().run()}>Del Col</Button>
                 <Button size="small" onClick={() => editor.chain().focus().addRowBefore().run()}>Add Row Before</Button>
                 <Button size="small" onClick={() => editor.chain().focus().addRowAfter().run()}>Add Row After</Button>
                 <Button size="small" onClick={() => editor.chain().focus().deleteRow().run()}>Del Row</Button>
                 <Button size="small" color="error" onClick={() => editor.chain().focus().deleteTable().run()}>Del Table</Button>
               </Box>
            )}

            {/* TipTap Area */}
            <Box sx={{ 
              flexGrow: 1, 
              border: `1px solid ${theme.palette.divider}`, 
              borderRadius: '12px', 
              p: 2,
              '& .ProseMirror': {
                outline: 'none',
                minHeight: '200px',
                '& p': { mb: 2 },
                '& h1': { fontSize: '2rem', mb: 2 },
                '& h2': { fontSize: '1.5rem', mb: 2 },
                '& code': { bgcolor: 'action.hover', p: '2px 4px', borderRadius: '4px', fontFamily: 'monospace' },
                '& pre': { bgcolor: 'action.hover', p: 2, borderRadius: '8px', mb: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-word', '& code': { p: 0, bgcolor: 'transparent', whiteSpace: 'pre-wrap' } },
                '& img': { maxWidth: '100%', borderRadius: '8px' },
                '& blockquote': { borderLeft: `4px solid ${theme.palette.primary.main}`, pl: 2, fontStyle: 'italic', color: 'text.secondary', mb: 2 },
                '& table': { borderCollapse: 'collapse', width: '100%', mb: 2, '& th, & td': { border: `1px solid ${theme.palette.divider}`, p: 1, position: 'relative' }, '& th': { bgcolor: 'action.hover', fontWeight: 'bold' } },
              }
            }}>
              <EditorContent editor={editor} />
            </Box>
          </Paper>
        </Grid>

        {/* Right Side: Preview */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ height: '100%', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', minWidth: 0 }}>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PreviewIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Live Preview</Typography>
          </Box>
          <Paper 
            elevation={0}
            sx={{ 
              flexGrow: 1, 
              borderRadius: '20px', 
              bgcolor: 'background.paper', 
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'auto',
              p: 0,
            }}
          >
            {/* Frontend Simulation Container */}
            <Box sx={{ maxWidth: 850, mx: 'auto', p: { xs: 2, md: 6 }, color: 'text.primary', fontFamily: '"Inter", sans-serif' }}>
              {coverImage && (
                <Box sx={{ width: '100%', aspectRatio: '16/8', borderRadius: '20px', overflow: 'hidden', mb: 4, shadow: 10 }}>
                  <img src={coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {categoryIds.length > 0 ? (
                  categoryIds.map(id => {
                    const cat = categories.find(c => c.id === id);
                    return cat ? <Box key={id} sx={{ px: 1.5, py: 0.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>{cat.name}</Box> : null;
                  })
                ) : (
                  <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'action.hover', color: 'text.secondary', borderRadius: '20px', fontSize: '0.75rem' }}>Uncategorized</Box>
                )}
              </Box>

              <Typography variant="h2" sx={{ fontWeight: 800, mb: 4, letterSpacing: '-0.04em', lineHeight: 1.1, color: 'text.primary', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                {title || 'Untitled Post'}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 8, color: 'text.secondary' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7c6af7, #6366f1)', display: 'flex', alignItems: 'center', justify: 'center', color: 'white', fontWeight: 'bold' }}>SS</Box>
                <Typography variant="body2">By Sameer • {new Date().toLocaleDateString()}</Typography>
              </Box>

              <Box 
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, {
                  ALLOWED_TAGS: ['p', 'h1','h2','h3','ul','ol','li','code','pre','strong','em','a','img','blockquote','br','span'],
                  ALLOWED_ATTR: ['href','src','alt','class','style']
                }) }} 
                sx={{
                  '& p': { mb: 3, lineHeight: 1.8, fontSize: '1.125rem', color: 'text.secondary' },
                  '& h2': { fontSize: '2rem', fontWeight: 700, mt: 6, mb: 3, color: 'text.primary' },
                  '& h3': { fontSize: '1.5rem', fontWeight: 600, mt: 5, mb: 2, color: 'text.primary' },
                  '& img': { maxWidth: '100%', borderRadius: '16px', my: 6, boxShadow: 3 },
                  '& blockquote': { borderLeft: '4px solid #7c6af7', pl: 6, py: 1, my: 6, '& p': { fontStyle: 'italic', color: 'text.secondary', mb: 0 } },
                  '& pre': { bgcolor: alpha(theme.palette.background.paper, 0.8), p: 4, borderRadius: '12px', mb: 6, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', border: `1px solid ${theme.palette.divider}` },
                  '& code': { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.9em' },
                  '& a': { color: theme.palette.primary.main, textDecoration: 'none' },
                  '& ul, & ol': { mb: 6, pl: 5, '& li': { mb: 1, color: 'text.secondary' } },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Image Upload Dialog for Editor */}
      <Dialog 
        open={imageDialogOpen} 
        onClose={() => setImageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '20px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Insert Image</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <ImageUpload 
              folder="blogs"
              deferred={true}
              onUploadSuccess={handleEditorImageUpload}
              onFileSelect={handleEditorImageSelect}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* New Category Dialog */}
      <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Category Name"
            placeholder="e.g. System Design"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={creatingCategory}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCategoryDialogOpen(false)} disabled={creatingCategory}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateCategory} 
            disabled={!newCategoryName || creatingCategory}
            startIcon={creatingCategory ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {creatingCategory ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
