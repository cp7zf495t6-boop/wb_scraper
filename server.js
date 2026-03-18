/**
 * Wildberries Review Scraper - HTTP API Version
 * 使用 Wildberries 内部API 直接获取评论数据
 */

import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(express.json({ limit: '100mb' }));

const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// 解析Wildberries URL获取产品ID
function parseWBUrl(url) {
  const patterns = [
    /wildberries\.ru\/catalog\/(\d+)/i,
    /www\.wildberries\.ru\/catalog\/(\d+)/i,
    /catalog\.wb\.ru\/catalog\/(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { productId: match[1], valid: true };
    }
  }
  return { productId: null, valid: false };
}

// 提取变体ID和尺寸ID
function extractQueryParams(url) {
  const imtMatch = url.match(/imtId=(\d+)/i);
  const sizeMatch = url.match(/size=(\d+)/i);
  return {
    imtId: imtMatch ? imtMatch[1] : null,
    sizeId: sizeMatch ? sizeMatch[1] : null,
  };
}

// 使用Wildberries内部API获取评论
async function fetchReviews(productId, imtId = null, sizeId = null) {
  const reviews = [];
  const feedbackUrl = 'https://catalog.wb.ru/catalog/v2/feedbacks';

  try {
    // Wildberries的评论API参数
    const params = {
      id: productId,
      skip: 0,
      take: 100, // 每次获取100条
    };

    if (imtId) params['imtId'] = imtId;
    if (sizeId) params['sizeId'] = sizeId;

    console.log(`Fetching reviews from API for product ${productId}...`);

    // 尝试多个可能的API端点
    const apiEndpoints = [
      `https://catalog.wb.ru/catalog/v2/feedbacks?id=${productId}&skip=0&take=100`,
      `https://feedbacks.wb.ru/feedbacks/v2/product/${productId}`,
    ];

    let feedbacks = [];

    for (const endpoint of apiEndpoints) {
      try {
        const response = await axios.get(endpoint, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          },
          timeout: 30000,
        });

        if (response.data) {
          // 尝试不同的响应格式
          feedbacks = response.data.feedbacks ||
                      response.data.comments ||
                      response.data.data?.feedbacks ||
                      response.data.data?.comments ||
                      [];

          if (feedbacks.length > 0) {
            console.log(`Found ${feedbacks.length} feedbacks from ${endpoint}`);
            break;
          }
        }
      } catch (e) {
        console.log(`Failed to fetch from ${endpoint}: ${e.message}`);
      }
    }

    // 转换数据格式
    feedbacks.forEach((f, index) => {
      reviews.push({
        id: f.id || `f-${index}`,
        author: f.userName || f.legalName || f.author || 'Anonymous',
        rating: f.stars || f.rating || 5,
        content: f.text || f.comment || f.description || '',
        date: f.createdDate || f.date || '',
        specification: f.sizeName || f.colorName || f.variantName || f.productSize || '',
        pros: f.pros || '',
        cons: f.cons || '',
      });
    });

    return reviews;
  } catch (error) {
    console.error('API fetch error:', error.message);
    throw error;
  }
}

// 获取产品评论（支持分页）
async function fetchAllReviews(productId, imtId = null, sizeId = null) {
  const allReviews = [];
  const limit = 100;
  let skip = 0;
  let hasMore = true;

  console.log(`Fetching all reviews for product ${productId}...`);

  while (hasMore) {
    try {
      // 构建API URL
      let url = `https://catalog.wb.ru/catalog/v2/feedbacks?id=${productId}&skip=${skip}&take=${limit}`;
      if (imtId) url += `&imtId=${imtId}`;
      if (sizeId) url += `&sizeId=${sizeId}`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
        },
        timeout: 30000,
      });

      const feedbacks = response.data?.feedbacks || [];

      if (feedbacks.length === 0) {
        hasMore = false;
        break;
      }

      feedbacks.forEach((f) => {
        allReviews.push({
          id: f.id || `f-${skip}-${Math.random().toString(36).substr(2, 9)}`,
          author: f.userName || f.legalName || 'Anonymous',
          rating: f.stars || f.rating || 5,
          content: f.text || f.comment || f.description || '',
          date: f.createdDate || f.date || '',
          specification: f.sizeName || f.colorName || f.variantName || '',
          pros: f.pros || '',
          cons: f.cons || '',
        });
      });

      console.log(`Fetched ${allReviews.length} reviews so far...`);

      skip += limit;

      // 如果返回的数量少于请求的数量，说明没有更多数据了
      if (feedbacks.length < limit) {
        hasMore = false;
      }

      // 防止无限循环，最多获取1000条
      if (skip >= 1000) {
        hasMore = false;
      }

    } catch (error) {
      console.error(`Error fetching page at skip=${skip}:`, error.message);
      hasMore = false;
    }
  }

  return allReviews;
}

// 生成模拟评论数据（当API失败时使用）
function generateMockReviews(productId, count = 50) {
  const specs = ['黑色/S', '黑色/M', '黑色/L', '白色/S', '白色/M', '蓝色/L'];
  const reviews = [];

  for (let i = 0; i < count; i++) {
    const spec = specs[Math.floor(Math.random() * specs.length)];
    const rating = Math.floor(Math.random() * 5) + 1;
    const pros = ['质量很好', '尺寸合适', '物流快', '包装完好', '性价比高'][Math.floor(Math.random() * 5)];
    const cons = rating <= 2 ? ['质量差', '尺寸不对', '物流慢', '包装破损'][Math.floor(Math.random() * 4)] : '';

    reviews.push({
      id: `mock-${i}`,
      author: `用户${1000 + i}`,
      rating,
      content: rating >= 4
        ? `很满意！${pros}，推荐购买。`
        : `一般，${cons ? '缺点: ' + cons : '没什么特别的'}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      specification: spec,
      pros: rating >= 4 ? pros : '',
      cons: cons,
    });
  }

  return reviews;
}

// API 路由
app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const { productId, valid } = parseWBUrl(url);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid Wildberries URL' });
    }

    const { imtId, sizeId } = extractQueryParams(url);
    console.log(`Starting scrape for product: ${productId}, imtId: ${imtId}, sizeId: ${sizeId}`);

    let reviews = [];
    let dataSource = 'api';

    try {
      // 尝试从API获取真实数据
      reviews = await fetchAllReviews(productId, imtId, sizeId);

      if (reviews.length === 0) {
        console.log('API returned no reviews, using mock data');
        reviews = generateMockReviews(productId, 30);
        dataSource = 'mock';
      }
    } catch (error) {
      console.log('Failed to fetch from API, using mock data');
      reviews = generateMockReviews(productId, 30);
      dataSource = 'mock';
    }

    console.log(`Scraping complete. Total reviews: ${reviews.length}, Source: ${dataSource}`);

    res.json({
      success: true,
      productId,
      reviews,
      totalReviews: reviews.length,
      dataSource,
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: error.message || 'Scraping failed',
      details: 'Failed to scrape reviews. Please try again.'
    });
  }
});

// 获取服务器状态
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`WB Scraper server running on port ${PORT}`);
  console.log(`API endpoint: http://0.0.0.0:${PORT}/api/scrape`);
});
