import React, { useState, useEffect, useCallback } from 'react';
import {
    X,
    MessageSquare,
    User,
    Clock,
    Flag,
    AlertTriangle,
    Eye,
    ThumbsUp,
    ThumbsDown,
    Reply,
    MoreVertical,
    Shield,
    ExternalLink,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import "./ViewThread.scss";

interface Comment {
    id: string;
    author: string;
    content: string;
    createdAt: string;
    likes: number;
    dislikes: number;
    isReported: boolean;
    reportReason?: string;
    reportCount?: number;
    authorViolations: number;
    replies?: Comment[];
    isNested?: boolean;
}

interface ThreadData {
    post: {
        id: string;
        title: string;
        content: string;
        author: string;
        createdAt: string;
        views: number;
        likes: number;
        dislikes: number;
        isReported: boolean;
        reportReason?: string;
        reportCount?: number;
        authorViolations: number;
    };
    comments: Comment[];
    reportedItemId?: string;
    reportedItemType?: 'post' | 'comment';
}

interface ViewThreadProps {
    postId: string;
    threadData: ThreadData;
    isOpen: boolean;
    onClose: () => void;
}

const ViewThread: React.FC<ViewThreadProps> = ({ postId, threadData, isOpen, onClose }) => {
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            // Prevent background scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle backdrop click to close modal
    const handleBackdropClick = useCallback((event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const toggleCommentExpansion = useCallback((commentId: string) => {
        setExpandedComments(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(commentId)) {
                newExpanded.delete(commentId);
            } else {
                newExpanded.add(commentId);
            }
            return newExpanded;
        });
    }, []);

    const formatTimeAgo = useCallback((dateString: string): string => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
        
        return date.toLocaleDateString();
    }, []);

    const isItemReported = useCallback((id: string, type: 'post' | 'comment'): boolean => {
        return threadData.reportedItemId === id && threadData.reportedItemType === type;
    }, [threadData.reportedItemId, threadData.reportedItemType]);

    const renderComment = useCallback((comment: Comment, depth: number = 0): JSX.Element => {
        const isExpanded = expandedComments.has(comment.id);
        const hasReplies = comment.replies && comment.replies.length > 0;
        const isReportedItem = isItemReported(comment.id, 'comment');

        return (
            <div 
                key={comment.id} 
                className={`thread-comment ${isReportedItem ? 'reported-item' : ''}`}
                style={{ marginLeft: `${depth * 20}px` }}
            >
                {isReportedItem && (
                    <div className="reported-banner">
                        <AlertTriangle className="banner-icon" />
                        <span>This comment was reported for: {comment.reportReason}</span>
                        <span className="report-count">({comment.reportCount} reports)</span>
                    </div>
                )}
                
                <div className="comment-header">
                    <div className="comment-meta">
                        <div className="author-info">
                            <User className="author-icon" />
                            <span className="author-name">{comment.author}</span>
                            {comment.authorViolations > 0 && (
                                <span className="violations-badge">
                                    <Shield className="shield-icon" />
                                    {comment.authorViolations} violations
                                </span>
                            )}
                        </div>
                        <div className="time-info">
                            <Clock className="meta-icon" />
                            <span>{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                        {comment.isReported && (
                            <div className="reported-indicator">
                                <Flag className="flag-icon" />
                                <span>Reported</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="comment-content">
                    <p>{comment.content}</p>
                </div>

                <div className="comment-actions">
                    <div className="engagement-stats">
                        <div className="stat-item">
                            <ThumbsUp className="stat-icon" />
                            <span>{comment.likes}</span>
                        </div>
                        <div className="stat-item">
                            <ThumbsDown className="stat-icon" />
                            <span>{comment.dislikes}</span>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button className="action-btn" aria-label="Reply to comment">
                            <Reply className="action-icon" />
                            Reply
                        </button>
                        <button className="action-btn" aria-label="More options">
                            <MoreVertical className="action-icon" />
                        </button>
                    </div>
                </div>

                {hasReplies && (
                    <div className="replies-section">
                        <button 
                            className="toggle-replies-btn"
                            onClick={() => toggleCommentExpansion(comment.id)}
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? 'Hide' : 'Show'} replies`}
                        >
                            {isExpanded ? <ChevronUp /> : <ChevronDown />}
                            <span>
                                {isExpanded ? 'Hide' : 'Show'} {comment.replies!.length} 
                                {comment.replies!.length === 1 ? ' reply' : ' replies'}
                            </span>
                        </button>
                        
                        {isExpanded && (
                            <div className="nested-comments">
                                {comment.replies!.map(reply => renderComment(reply, depth + 1))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }, [expandedComments, formatTimeAgo, isItemReported, toggleCommentExpansion]);

    if (!isOpen) return null;

    return (
        <div 
            className="thread-modal-overlay" 
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="thread-title"
        >
            <div className="thread-modal">
                <div className="thread-header">
                    <div className="header-content">
                        <h2 id="thread-title" className="thread-title">View Thread</h2>
                        <div className="thread-stats">
                            <div className="stat-item">
                                <Eye className="stat-icon" />
                                <span>{threadData.post.views.toLocaleString()} views</span>
                            </div>
                            <div className="stat-item">
                                <MessageSquare className="stat-icon" />
                                <span>{threadData.comments.length} comments</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        className="close-btn" 
                        onClick={onClose}
                        aria-label="Close thread view"
                    >
                        <X className="close-icon" />
                    </button>
                </div>

                <div className="thread-content">
                    {/* Original Post */}
                    <div className={`thread-post ${isItemReported(threadData.post.id, 'post') ? 'reported-item' : ''}`}>
                        {isItemReported(threadData.post.id, 'post') && (
                            <div className="reported-banner">
                                <AlertTriangle className="banner-icon" />
                                <span>This post was reported for: {threadData.post.reportReason}</span>
                                <span className="report-count">({threadData.post.reportCount} reports)</span>
                            </div>
                        )}
                        
                        <div className="post-header">
                            <h3 className="post-title">{threadData.post.title}</h3>
                            <div className="post-meta">
                                <div className="author-info">
                                    <User className="author-icon" />
                                    <span className="author-name">{threadData.post.author}</span>
                                    {threadData.post.authorViolations > 0 && (
                                        <span className="violations-badge">
                                            <Shield className="shield-icon" />
                                            {threadData.post.authorViolations} violations
                                        </span>
                                    )}
                                </div>
                                <div className="time-info">
                                    <Clock className="meta-icon" />
                                    <span>{formatTimeAgo(threadData.post.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="post-content">
                            <p>{threadData.post.content}</p>
                        </div>

                        <div className="post-actions">
                            <div className="engagement-stats">
                                <div className="stat-item">
                                    <ThumbsUp className="stat-icon" />
                                    <span>{threadData.post.likes}</span>
                                </div>
                                <div className="stat-item">
                                    <ThumbsDown className="stat-icon" />
                                    <span>{threadData.post.dislikes}</span>
                                </div>
                            </div>
                            <div className="action-buttons">
                                <button className="action-btn" aria-label="Reply to post">
                                    <Reply className="action-icon" />
                                    Reply
                                </button>
                                <button className="action-btn" aria-label="Open in forum">
                                    <ExternalLink className="action-icon" />
                                    Open in Forum
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="comments-section">
                        <div className="comments-header">
                            <h4>Comments ({threadData.comments.length})</h4>
                        </div>
                        
                        <div className="comments-list">
                            {threadData.comments.length > 0 ? (
                                threadData.comments.map(comment => renderComment(comment))
                            ) : (
                                <div className="no-comments">
                                    <MessageSquare className="no-comments-icon" />
                                    <p>No comments yet. Be the first to comment!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewThread;