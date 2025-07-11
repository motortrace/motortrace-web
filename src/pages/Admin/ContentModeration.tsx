import React, { useState } from 'react';
import {
    AlertTriangle,
    Eye,
    EyeOff,
    MessageSquare,
    Clock,
    Flag,
    CheckCircle,
    Search,
    MoreVertical,
    Ban,
    AlertCircle,
    UserX,
    Mail,
    FileText,
    Reply,
    Gavel
} from 'lucide-react';
import '../../components/Admin/ViewForumThread/ViewThread'
import './ContentModeration.scss';
import ViewThread from '../../components/Admin/ViewForumThread/ViewThread';

// Define types
interface Report {
    id: number;
    contentType: 'comment' | 'post';
    postId: string;
    commentId: string | null;
    postTitle: string;
    postContent: string;
    commentContent: string | null;
    reportedBy: string;
    reportedAt: string;
    reason: string;
    status: 'pending' | 'resolved' | 'actioned';
    severity: 'low' | 'medium' | 'high';
    reportCount: number;
    authorId: string;
    authorName: string;
    authorViolations: number;
    originalPostAuthor: string;
}

interface Post {
    id: string;
    title: string;
    author: string;
    createdAt: string;
    replies: number;
    views: number;
    status: 'active' | 'hidden';
    hasReportedComments: boolean;
    reportedCommentsCount: number;
    reported?: boolean;
}

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

type ActionType = 'approve' | 'hide' | 'warn' | 'suspend' | 'ban';

interface ActionOption {
    id: string;
    icon: React.ComponentType<any>;
    title: string;
    desc: string;
    color: string;
}

const ContentModeration = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterContentType, setFilterContentType] = useState('all');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedAction, setSelectedAction] = useState('');
    const [showThread, setShowThread] = useState(false);
    const [currentPostId, setCurrentPostId] = useState<string | null>(null);

    // Mock data for demonstration
    const [reports, setReports] = useState<Report[]>([
        {
            id: 1,
            contentType: 'comment',
            postId: 'POST-001',
            commentId: 'COMMENT-001',
            postTitle: 'Need help with BMW engine oil change',
            postContent: 'I need advice on changing oil in my BMW X5. What type of oil should I use and how often should I change it?',
            commentContent: 'Check out this amazing deal on fake parts: www.scam-auto-parts.com - super cheap BMW parts here! Don\'t waste money on expensive OEM parts when you can get knockoffs for 90% less!',
            reportedBy: 'Shake Aurad',
            reportedAt: '2025-01-15T10:30:00Z',
            reason: 'Spam',
            status: 'pending',
            severity: 'medium',
            reportCount: 3,
            authorId: 'spamUser1',
            authorName: 'Saman Bandara',
            authorViolations: 2,
            originalPostAuthor: 'Kamal Perera'
        },
        {
            id: 2,
            contentType: 'comment',
            postId: 'POST-002',
            commentId: 'COMMENT-002',
            postTitle: 'Transmission problems Toyota Camry',
            postContent: 'My 2018 Toyota Camry is having transmission issues. It slips when shifting from 2nd to 3rd gear.',
            commentContent: 'You idiots don\'t know anything about cars. This forum is full of morons who give terrible advice. Get a real mechanic, losers!',
            reportedBy: 'Simak Niyaz',
            reportedAt: '2025-01-15T09:15:00Z',
            reason: 'Abusive',
            status: 'pending',
            severity: 'high',
            reportCount: 6,
            authorId: 'abusiveUser1',
            authorName: 'Rajiv Jayawardena',
            authorViolations: 1,
            originalPostAuthor: 'Sunil Fernando'
        },
        {
            id: 3,
            contentType: 'comment',
            postId: 'POST-003',
            commentId: 'COMMENT-005',
            postTitle: 'Best tire brands for Sri Lankan roads?',
            postContent: 'Looking to replace the tires on my Honda Civic. Which tire brands handle potholes and wet conditions best in Sri Lanka?',
            commentContent: 'Visit my site for super cheap tires: www.fake-tires-lk.com',
            reportedBy: 'Nihmath Jabir',
            reportedAt: '2025-01-14T16:20:00Z',
            reason: 'Spam',
            status: 'pending',
            severity: 'medium',
            reportCount: 4,
            authorId: 'spamUser2',
            authorName: 'Aravindh Saamy',
            authorViolations: 1,
            originalPostAuthor: 'Dilshan Perera'
        },
        {
            id: 4,
            contentType: 'comment',
            postId: 'POST-005',
            commentId: 'COMMENT-008',
            postTitle: 'Hybrid battery maintenance tips?',
            postContent: 'I own a Toyota Prius. Any tips to extend the hybrid battery lifespan in Sri Lanka’s climate?',
            commentContent: 'Only idiots buy hybrids, get a real car!',
            reportedBy: 'Sadheeya Salim',
            reportedAt: '2025-01-14T14:00:00Z',
            reason: 'Abusive',
            status: 'pending',
            severity: 'medium',
            reportCount: 3,
            authorId: 'abusiveUser1',
            authorName: 'Godfry John',
            authorViolations: 1,
            originalPostAuthor: 'Kasun Jayawardena'
        },

    ]);

    const [allPosts, setAllPosts] = useState<Post[]>([
        {
            id: 'POST-001',
            title: 'Need help with BMW engine oil change',
            author: 'Kamal Perera',
            createdAt: '2025-01-15T08:00:00Z',
            replies: 2,
            views: 45,
            status: 'active',
            hasReportedComments: true,
            reportedCommentsCount: 1
        },
        {
            id: 'POST-002',
            title: 'Transmission problems Toyota Camry',
            author: 'Sunil Fernando',
            createdAt: '2025-01-15T07:30:00Z',
            replies: 2,
            views: 32,
            status: 'active',
            hasReportedComments: true,
            reportedCommentsCount: 1
        },
        {
            id: 'POST-003',
            title: 'Best tire brands for Sri Lankan roads?',
            author: 'Dilshan Perera',
            createdAt: '2025-01-16T08:20:00Z',
            replies: 2,
            views: 15,
            status: 'active',
            hasReportedComments: true,
            reportedCommentsCount: 1
        },
        {
            id: 'POST-004',
            title: 'AC not cooling properly',
            author: 'Nadeesha Gunasekara',
            createdAt: '2025-01-14T12:00:00Z',
            replies: 1,
            views: 17,
            status: 'active',
            hasReportedComments: false,
            reportedCommentsCount: 0
        },
        {
            id: 'POST-005',
            title: 'Hybrid battery maintenance tips?',
            author: 'Kasun Jayawardena',
            createdAt: '2025-01-13T14:00:00Z',
            replies: 2,
            views: 78,
            status: 'active',
            hasReportedComments: true,
            reportedCommentsCount: 1
        }
    ]);

    const threadDataMap: Record<string, ThreadData> = {
        'POST-001': {
            post: {
                id: 'POST-001',
                title: 'Need help with BMW engine oil change',
                content: 'I need advice on changing oil in my BMW X5. What type of oil should I use and how often should I change it? I\'ve heard different recommendations and want to make sure I\'m doing it right.',
                author: 'Kamal Perera',
                createdAt: '2025-01-15T08:00:00Z',
                views: 45,
                likes: 12,
                dislikes: 1,
                isReported: false,
                authorViolations: 0
            },
            comments: [
                {
                    id: 'COMMENT-001',
                    author: 'Saman Bandara',
                    content: 'Check out this amazing deal on fake parts: www.scam-auto-parts.com - super cheap BMW parts here! Don\'t waste money on expensive OEM parts when you can get knockoffs for 90% less!',
                    createdAt: '2025-01-15T10:30:00Z',
                    likes: 0,
                    dislikes: 8,
                    isReported: true,
                    reportReason: 'spam',
                    reportCount: 3,
                    authorViolations: 2
                },
                {
                    id: 'COMMENT-002',
                    author: 'Nimal Silva',
                    content: 'For BMW X5, I recommend using synthetic oil like Castrol or Mobil 1. Change it every 7,500-10,000 miles depending on your driving conditions.',
                    createdAt: '2025-01-15T11:00:00Z',
                    likes: 15,
                    dislikes: 0,
                    isReported: false,
                    authorViolations: 0,
                    replies: [
                        {
                            id: 'REPLY-001',
                            author: 'Kamal Perera',
                            content: 'Thank you! Should I go with 5W-30 or 0W-20?',
                            createdAt: '2025-01-15T11:30:00Z',
                            likes: 3,
                            dislikes: 0,
                            isReported: false,
                            authorViolations: 0
                        }
                    ]
                }
            ],
            reportedItemId: 'COMMENT-001',
            reportedItemType: 'comment'
        },
        'POST-002': {
            post: {
                id: 'POST-002',
                title: 'Transmission problems Toyota Camry',
                content: 'My 2018 Toyota Camry is having transmission issues. It slips when shifting from 2nd to 3rd gear.',
                author: 'Sunil Fernando',
                createdAt: '2025-01-15T07:30:00Z',
                views: 32,
                likes: 5,
                dislikes: 0,
                isReported: false,
                authorViolations: 0
            },
            comments: [
                {
                    id: 'COMMENT-002',
                    author: 'Rajiv Jayawardena',
                    content: 'You idiots don\'t know anything about cars! Get a real mechanic, losers!',
                    createdAt: '2025-01-15T09:15:00Z',
                    likes: 0,
                    dislikes: 12,
                    isReported: true,
                    reportReason: 'abusive',
                    reportCount: 6,
                    authorViolations: 1
                },
                {
                    id: 'COMMENT-003',
                    author: 'Priyantha Rathnayake',
                    content: 'Check your transmission fluid level first. Low fluid often causes slipping.',
                    createdAt: '2025-01-15T10:00:00Z',
                    likes: 8,
                    dislikes: 0,
                    isReported: false,
                    authorViolations: 0
                }
            ],
            reportedItemId: 'COMMENT-002',
            reportedItemType: 'comment'
        },
        'POST-003': {
            post: {
                id: 'POST-003',
                title: 'Best tire brands for Sri Lankan roads?',
                content: 'Looking to replace the tires on my Honda Civic. Which tire brands handle potholes and wet conditions best in Sri Lanka?',
                author: 'Dilshan Perera',
                createdAt: '2025-01-16T08:20:00Z',
                views: 60,
                likes: 18,
                dislikes: 0,
                isReported: false,
                authorViolations: 0
            },
            comments: [
                {
                    id: 'COMMENT-004',
                    author: 'Ruwan Fernando',
                    content: 'Try Michelin or Bridgestone. They last long and have good grip even in heavy rain.',
                    createdAt: '2025-01-16T09:00:00Z',
                    likes: 10,
                    dislikes: 0,
                    isReported: false,
                    authorViolations: 0
                },
                {
                    id: 'COMMENT-005',
                    author: 'Aravindh Saamy',
                    content: 'Visit my site for super cheap tires: www.fake-tires-lk.com',
                    createdAt: '2025-01-16T09:30:00Z',
                    likes: 0,
                    dislikes: 5,
                    isReported: true,
                    reportReason: 'spam',
                    reportCount: 4,
                    authorViolations: 1
                }
            ],
            reportedItemId: 'COMMENT-005',
            reportedItemType: 'comment'
        },
        'POST-004': {
            post: {
                id: 'POST-004',
                title: 'AC not cooling properly',
                content: 'My car AC isn’t cooling well even after a gas refill. What could be wrong?',
                author: 'Nadeesha Gunasekara',
                createdAt: '2025-01-17T07:50:00Z',
                views: 48,
                likes: 9,
                dislikes: 0,
                isReported: false,
                authorViolations: 0
            },
            comments: [
                {
                    id: 'COMMENT-006',
                    author: 'Mahesh Wijesinghe',
                    content: 'It might be a leak or your compressor could be weak. Get a mechanic to do a leak test first.',
                    createdAt: '2025-01-17T08:30:00Z',
                    likes: 7,
                    dislikes: 0,
                    isReported: false,
                    authorViolations: 0
                }
            ]
        },
        'POST-005': {
            post: {
                id: 'POST-005',
                title: 'Hybrid battery maintenance tips?',
                content: 'I own a Toyota Prius. Any tips to extend the hybrid battery lifespan in Sri Lanka’s climate?',
                author: 'Kasun Jayawardena',
                createdAt: '2025-01-17T10:00:00Z',
                views: 55,
                likes: 15,
                dislikes: 0,
                isReported: false,
                authorViolations: 0
            },
            comments: [
                {
                    id: 'COMMENT-007',
                    author: 'Chathura Ranasinghe',
                    content: 'Park in shaded areas to avoid heat damage and do regular hybrid system checkups.',
                    createdAt: '2025-01-17T11:00:00Z',
                    likes: 11,
                    dislikes: 0,
                    isReported: false,
                    authorViolations: 0
                },
                {
                    id: 'COMMENT-008',
                    author: 'Godfry John',
                    content: 'Only idiots buy hybrids, get a real car!',
                    createdAt: '2025-01-17T11:20:00Z',
                    likes: 0,
                    dislikes: 9,
                    isReported: true,
                    reportReason: 'abusive',
                    reportCount: 3,
                    authorViolations: 1
                }
            ],
            reportedItemId: 'COMMENT-008',
            reportedItemType: 'comment'
        },
    };



    const handleAction = (action: ActionType, reportId: number) => {
        setReports(reports.map(report =>
            report.id === reportId
                ? { ...report, status: action === 'approve' ? 'resolved' : 'actioned' }
                : report
        ));
        setShowActionModal(false);
        setSelectedReport(null);
    };

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.postTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (report.commentContent && report.commentContent.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
        const matchesContentType = filterContentType === 'all' || report.contentType === filterContentType;
        return matchesSearch && matchesFilter && matchesContentType;
    });

    const filteredPosts = allPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getActionButtonText = (report: Report): string => {
        if (report.contentType === 'post') {
            return 'Take Action on Post';
        } else {
            return 'Take Action on Comment';
        }
    };

    const getActionOptions = (report: Report): ActionOption[] => {
        if (report.contentType === 'post') {
            return [
                { id: 'hide', icon: EyeOff, title: 'Hide Post', desc: 'Remove entire post from public view', color: 'gray' },
                { id: 'warn', icon: Mail, title: 'Send Warning', desc: 'Notify user about policy violation', color: 'yellow' },
                { id: 'suspend', icon: UserX, title: 'Suspend User', desc: 'Temporarily ban user account', color: 'red' },
                { id: 'ban', icon: Ban, title: 'Permanent Ban', desc: 'Permanently remove user access', color: 'red' }
            ];
        } else {
            return [
                { id: 'hide', icon: EyeOff, title: 'Hide Comment', desc: 'Remove comment only (keep post visible)', color: 'gray' },
                { id: 'warn', icon: Mail, title: 'Send Warning', desc: 'Notify commenter about policy violation', color: 'yellow' },
                { id: 'suspend', icon: UserX, title: 'Suspend User', desc: 'Temporarily ban user account', color: 'red' },
                { id: 'ban', icon: Ban, title: 'Permanent Ban', desc: 'Permanently remove user access', color: 'red' }
            ];
        }
    };

    return (
        <div className="moderation-dashboard">

            <div className="moderation-dashboard__tabs">

                <button
                    className={`moderation-dashboard__tab ${activeTab === 'posts' ? 'moderation-dashboard__tab--active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    <span className="moderation-dashboard__tab-icon">
                        <MessageSquare />
                    </span>
                    All Posts ({allPosts.length})
                </button>

                <button
                    className={`moderation-dashboard__tab ${activeTab === 'reports' ? 'moderation-dashboard__tab--active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    <span className="moderation-dashboard__tab-icon">
                        <Flag />
                    </span>
                    Reports ({reports.filter(r => r.status === 'pending').length})
                </button>

            </div>

            {/* Search and Filter Bar */}
            <div className="search-bar">
                <div className="search-content">
                    <div className="search-input-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search posts, comments, users, or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {activeTab === 'reports' && (
                        <div className="filters">

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Reports</option>
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                                <option value="actioned">Actioned</option>
                            </select>

                            <select
                                value={filterContentType}
                                onChange={(e) => setFilterContentType(e.target.value)}
                            >
                                <option value="all">All Content</option>
                                <option value="post">Posts Only</option>
                                <option value="comment">Comments Only</option>
                            </select>

                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {activeTab === 'reports' ? (
                    <div className="reports-list">
                        {filteredReports.map((report) => (
                            <div key={report.id} className="report-card">
                                <div className="report-content">
                                    {/* Header with badges and meta info */}
                                    <div className="report-header">
                                        <div className="badges-row">
                                            <div className="badges">
                                                <span className={`badge ${report.contentType}`}>
                                                    {report.contentType === 'post' ? 'POST' : 'COMMENT'}
                                                </span>
                                                <span className={`badge ${report.severity}-severity`}>
                                                    {report.severity.toUpperCase()}
                                                </span>
                                                <span className={`badge ${report.status}`}>
                                                    {report.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="report-count">
                                                {report.reportCount} report{report.reportCount > 1 ? 's' : ''}
                                            </div>
                                        </div>

                                        <div className="report-meta">
                                            <div className="meta-item">
                                                <Clock className="meta-icon" />
                                                <span>{new Date(report.reportedAt).toLocaleString()}</span>
                                            </div>
                                            <div className="meta-item">
                                                <Flag className="meta-icon" />
                                                <span>by {report.reportedBy}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title and reason */}
                                    <div className="report-title-section">
                                        <h3 className="report-title">{report.postTitle}</h3>
                                        <div className="report-reason">
                                            <AlertTriangle className="reason-icon" />
                                            <span className="reason-text">
                                                Reported for: {report.reason}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content sections */}
                                    <div className="content-sections">
                                        {/* Original Post Content */}
                                        <div className="content-section">
                                            <div className="content-header">
                                                <FileText className="content-icon post-icon" />
                                                <span className="content-label">Original Post</span>
                                                <span className="content-author">by {report.originalPostAuthor}</span>
                                            </div>
                                            <div className="content-box original-post">
                                                <p>{report.postContent}</p>
                                            </div>
                                        </div>

                                        {/* Reported Comment Content (if applicable) */}
                                        {report.contentType === 'comment' && report.commentContent && (
                                            <div className="content-section reported-section">
                                                <div className="content-header">
                                                    <Reply className="content-icon comment-icon" />
                                                    <span className="content-label">Reported Comment</span>
                                                    <span className="content-author">
                                                        by {report.authorName}
                                                        {report.authorViolations > 0 && (
                                                            <span className="violations">({report.authorViolations} violations)</span>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="content-box reported-content">
                                                    <p>{report.commentContent}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Reported Post Content (if post is reported) */}
                                        {report.contentType === 'post' && (
                                            <div className="content-section reported-section">
                                                <div className="content-header">
                                                    <AlertTriangle className="content-icon alert-icon" />
                                                    <span className="content-label">Reported Content</span>
                                                    <span className="content-author">
                                                        by {report.authorName}
                                                        {report.authorViolations > 0 && (
                                                            <span className="violations">({report.authorViolations} violations)</span>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="content-box reported-content">
                                                    <p>{report.postContent}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    {report.status === 'pending' && (
                                        <div className="report-actions">
                                            <button
                                                onClick={() => {
                                                    setSelectedReport(report);
                                                    setShowActionModal(true);
                                                }}
                                                className="action-btn take-action"
                                            >
                                                <Gavel className="btn-icon" />
                                                <span>{getActionButtonText(report)}</span>
                                            </button>
                                            <button
                                                onClick={() => handleAction('approve', report.id)}
                                                className="action-btn dismiss"
                                            >
                                                <CheckCircle className="btn-icon" />
                                                <span>Dismiss Report</span>
                                            </button>
                                            <button
                                                className="action-btn view-thread"
                                                onClick={() => {
                                                    setCurrentPostId(report.postId);
                                                    setShowThread(true);
                                                }}
                                            >
                                                <Eye className="btn-icon" />
                                                <span>View Thread</span>
                                            </button>

                                        </div>
                                    )}
                                </div>
                            </div>

                        ))}

                    </div>
                ) : (
                    <div className="posts-table">
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Post</th>
                                        <th>Author</th>
                                        <th>Engagement</th>
                                        <th>Issues</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPosts.map((post) => (
                                        <tr key={post.id}>
                                            <td className="post-cell">
                                                <div className="post-info">
                                                    <div className="post-details">
                                                        <div className="post-title">
                                                            <span>{post.title}</span>
                                                            {post.reported && (
                                                                <AlertCircle className="alert-icon" />
                                                            )}
                                                        </div>
                                                        <div className="post-id">{post.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="author-cell">{post.author}</td>
                                            <td className="engagement-cell">
                                                <div>{post.replies} replies</div>
                                                <div>{post.views} views</div>
                                            </td>
                                            <td className="issues-cell">
                                                <div className="issues-list">
                                                    {post.reported && (
                                                        <span className="issue-item reported">Post reported</span>
                                                    )}
                                                    {post.hasReportedComments && (
                                                        <span className="issue-item comments-reported">
                                                            {post.reportedCommentsCount} comment{post.reportedCommentsCount > 1 ? 's' : ''} reported
                                                        </span>
                                                    )}
                                                    {!post.reported && !post.hasReportedComments && (
                                                        <span className="issue-item no-issues">No issues</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="status-cell">
                                                <span className={`status-badge ${post.status}`}>
                                                    {post.status}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                <div className="action-buttons">
                                                    <button
                                                        className="view-btn"
                                                        onClick={() => {
                                                            setCurrentPostId(post.id);
                                                            setShowThread(true);
                                                        }}
                                                    >
                                                        <Eye className="action-icon" />
                                                    </button>
                                                    <button className="menu-btn" title="More options">
                                                        <MoreVertical className="action-icon" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {showThread && currentPostId && (
                <ViewThread
                    postId={currentPostId}
                    threadData={threadDataMap[currentPostId]}
                    isOpen={showThread}
                    onClose={() => setShowThread(false)}
                />
            )}

            {/* Action Modal */}
            {showActionModal && selectedReport && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-header">
                            Take Action on {selectedReport.contentType === 'post' ? 'Post' : 'Comment'}
                        </h3>
                        <p className="modal-description">
                            Choose an action for the reported {selectedReport.contentType}: "{selectedReport.postTitle}"
                            {selectedReport.contentType === 'comment' && (
                                <span className="modal-note">
                                    Note: Taking action on a comment will not affect the original post.
                                </span>
                            )}
                        </p>

                        <div className="action-options">
                            {getActionOptions(selectedReport).map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleAction(option.id as ActionType, selectedReport.id)}
                                    className="action-option"
                                >
                                    <option.icon className={`option-icon ${option.color}`} />
                                    <div className="option-content">
                                        <div className="option-title">{option.title}</div>
                                        <div className="option-desc">{option.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="modal-actions">
                            <button
                                onClick={() => setShowActionModal(false)}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentModeration;