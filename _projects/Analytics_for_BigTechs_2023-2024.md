---
layout: page
title: Analytics for BigTechs in 2023-2024
description: A closer look at how the biggest tech players are using analytics to advance their key priorities.
img: assets/img/analytics_bigtechs_2024_cover.jpeg
importance: 7
category: MIT (2023-2024)
related_publications: 
---

Project Report, MIT 15.681 - From Analytics to Action <br>
Team Members:
[Maxime Wolf](https://www.linkedin.com/in/maxime-wolf/),
[Jason Jia](https://www.linkedin.com/in/jasonjiajs/),
[Minnie Arunaramwong](https://www.linkedin.com/in/minnie-arunaramwong/),
[Dongming Shen](https://www.linkedin.com/in/dongmingshen/),
[Tim Zhou](https://www.linkedin.com/in/dingyi-zhou/),
[Kevin Sheng](https://www.linkedin.com/in/kaiyuan-sheng/)

### Introduction

It is well-known that advances in analytics have been instrumental in helping tech firms generate insights from data and unlock tremendous business value. However, given that the world’s biggest tech players already have immensely capable analytic capabilities, an intriguing question is how they plan to further use analytics to advance their key priorities, ranging from short-term KPIs to long-term roadmaps.

In this report, we aim to shed light on the future significance of analytics in the tech industry by focusing on key players and taking a deep dive into how specific data science techniques will be key to advancing their strategic goals.

### Case Studies

#### Google - Ads (AI, Retail, YouTube)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/analytics_bigtechs_2024/google.jpeg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Google Ads
</div>

Advertising accounted for 80% of Google’s revenues in 2022 and is indisputably its top priority. During the 2023 Q3 earnings call, Philipp Schindler (SVP, CBO) stated that the “three key priority areas for Ads [are] Google AI, Retail, and YouTube”.

Given the potential existential threat posed by AI-integrated information retrieval systems such as ChatGPT and Bing Search, it is unsurprising for Google to focus on accelerating the use of AI in Search. In Q2, Google announced innovations such as conversational experiences in Google Ads (using AI assistant to create new marketing content) and updates to Performance Max (automated bidding and budget optimization using AI). Further work on these features will involve Large Language Models even more powerful than the newly released Gemini (announced in Dec 2023), as well as creating a user interface that seamlessly blends traditional search with AI-generated replies for a multitude of potential use cases.

On the retail side, it is focusing on introducing businesses with more pricing and inventory planning tools to handle an increasing number of “micro-peaks” expected during Q4, which features an extended period of heavy discounts. These may require tools such as optimization and reinforcement learning to learn the best strategy that maximizes rewards.

Finally, AI helps not just advertisers, but also creators on YouTube. Dream Screen (creating image backgrounds for YouTube videos using AI) and YouTube Create (video publishing tools) can help creators cut time and find inspiration for higher-quality videos. Under Spotlight Moments (enabling advertisers to place their promotions within the most popular content around certain themes), AI can also be used to identify trending video content around major cultural moments for brand sponsorship opportunities. This requires AI-based video identification and sorting, which is likely to involve neural network methods such as Masked Autoencoders (MAE) built on Vision Transformers (ViT) as well as contrastive learning.

#### Apple - Ecosystem Expansion (Customer Experience, Services, AR/VR)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/analytics_bigtechs_2024/apple.webp" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Apple ecosystem
</div>

At Apple, expanding its ecosystem beyond hardware sales remains its top priority. This is evident in its ever-growing focus on customer experience, services, and augmented/virtual reality (AR/VR). In 2023, CEO Tim Cook emphasized that "the strength and vibrancy of our ecosystem" is fundamental to the company's success.

One key area where Apple leverages analytics is in tailoring the customer experience. By analyzing user data from various sources, including Apple Watch health metrics and App Store usage patterns, Apple can personalize recommendations, optimize product features, and provide targeted support. This data-driven approach enhances customer satisfaction and loyalty, ultimately driving further ecosystem engagement.

Services are another significant area where Apple uses analytics to its advantage. With Apple Music, Apple TV+, and Apple Arcade, the company relies heavily on data insights to curate content recommendations, predict customer churn, and develop new offerings. For example, analyzing user playlists and streaming behavior allows Apple Music to suggest new songs and personalize playlists, potentially increasing subscription retention.

Finally, Apple is heavily invested in AR/VR, a nascent technology with immense potential. Analytics plays a crucial role in this domain as well. To develop intuitive and engaging AR/VR experiences, Apple analyzes user interactions with existing apps and devices to understand user behavior and preferences. This data guides the development of future AR/VR products and services, ensuring they are user-centric and meet evolving needs. Recently, Apple introduced Vision Pro, further advancing its capabilities in AR/VR technologies.

Overall, Apple's focus on ecosystem expansion, coupled with its strategic utilization of analytics, creates significant value for both society and the business. By prioritizing customer experience, expanding services, and investing in AR/VR, Apple positions itself as a leader in the tech industry, enhancing user experiences and driving innovation.

#### Microsoft - The Age of Copilot for Personal/Enterprise Uses and Cloud Computing

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/analytics_bigtechs_2024/microsoft.jpeg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Microsoft Copilot
</div>

At Microsoft Ignite 2023, an annual conference for IT professionals worldwide, Microsoft inaugurated the main keynote with a substantial focus on AI, integrating AI features into all its products. "We believe in a future where there will be a copilot for everyone and everything you do," stated Satya Nadella, the executive chairman and CEO, underscoring the company's commitment to empowering individuals through AI. In its quest to establish itself as a copilot-centric entity, enterprise versions of Copilot for Microsoft 365, Microsoft Studio, and Microsoft Azure are now accessible to companies such as Accenture, EY, and PwC. It is asserted that 70% of users experience increased productivity, with 29% exhibiting heightened efficiency in specific tasks.

Given that its Cloud service contributed $28.8 billion, constituting 54% of the company's total revenue in Q3 2023, Microsoft's priority aligns with the burgeoning customer demands for aggressive AI investments. Through partnerships with OpenAI, Microsoft leverages ChatGPT capabilities to enhance search, collaboration, work, and learning. On the hardware front, Microsoft introduced a new AI accelerator chip called Microsoft Azure Maia, tailored for intensive AI workloads such as Bing, ChatGPT, and other Large Language Models. This is complemented by a novel fast storage and networking system known as Azure Boost.

To cultivate an AI-centric culture, Microsoft Fabric emerges as the solution to seamlessly connect data and AI tools. Functioning as an all-encompassing analytics solution, it spans from data movement to data science and business insights. Microsoft Fabric also integrates with Copilot, alongside Office and Teams, echoing the data culture throughout the organization.
Microsoft persists in refining its products with an unwavering focus on enhancing the user experience. The company envisions the imminent era of Copilot, where individuals gain seamless access to both personal and organizational knowledge.

#### Salesforce - Revolutionizing Customer Relationship Management (CRM) with Einstein Analytics

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/analytics_bigtechs_2024/salesforce.webp" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Salesforce Einstein
</div>

Salesforce is an American cloud-based software company, renowned for its innovation in customer relationship management (CRM) and has been a pioneer in integrating analytics into its services. The company's Einstein Analytics platform is a prime example of this integration, showcasing how artificial intelligence (AI) and analytics can revolutionize business processes, especially in understanding and interacting with customers.

Einstein Analytics is an AI-powered analytics tool embedded within Salesforce's CRM ecosystem. It goes beyond traditional analytics by not only analyzing vast amounts of CRM data but also providing predictive insights and recommendations. These uses of analytics allows businesses to make more informed decisions, forecast future trends, and tailor their strategies to meet customer needs more effectively.

One key feature of Einstein Analytics is its predictive capabilities. It sifts through historical data to reveal trends and patterns, enabling businesses to foresee customer behavior and preferences. This foresight aids in predicting product preferences, churn likelihood, and identifying profitable customer segments. Einstein Analytics also enhances customer interaction personalization. Segmenting customers based on their history, interactions, and social media activities, helps businesses customize their marketing and sales approaches for different groups, thereby boosting the efficacy of these strategies.

Besides, in decision-making, Einstein Analytics is invaluable, offering interactive dashboards that simplify complex data. These tools provide real-time insights and key performance metrics, essential for rapid and informed decision-making in fast-paced business environments. 

Additionally, Salesforce continuously evolves Einstein Analytics with new features and capabilities. The integration of natural language processing allows users to query data using conversational language, making analytics more user-friendly and accessible to non-technical users.

Salesforce's use of analytics through Einstein Analytics exemplifies the transformative power of analytics in CRM. This not only drives business growth but also enhances customer satisfaction and loyalty, key factors for success in today's customer-centric business landscape.

#### Uber - Michelangelo Platform (Operational Efficiency, Dynamic Pricing, Route Optimization) 

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/analytics_bigtechs_2024/uber.jpeg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Uber app
</div>

Uber's focus in 2023, with its machine learning platform Michelangelo, is on elevating operational efficiency and customer experience. Michelangelo transforms Uber's vast data into actionable insights, streamlining processes and enhancing service delivery. The platform's predictive analytics capabilities are crucial for demand forecasting, enabling Uber to efficiently allocate drivers, thereby reducing wait times for riders and ensuring service availability and user satisfaction.

In the dynamic pricing area, Michelangelo supports real-time fare adjustments based on various factors like traffic, demand, and driver availability. This helps Uber balance supply and demand, a strategy essential for both maximizing revenue and maintaining customer satisfaction. Route optimization for drivers, another key feature of Michelangelo, ensures quicker, more efficient trips, benefiting both drivers and riders.

These advancements create significant value for Uber. For riders, they translate into reliable and efficient services, improving overall satisfaction. Drivers benefit from more trips and the potential for higher earnings, crucial in the gig economy. For Uber, these efficiencies lead to reduced operational costs and increased profitability, key in the competitive ride-sharing market.

Additionally, these improvements extend to societal benefits. Efficient transportation services contribute to reduced traffic congestion and lower carbon emissions, as better routing and increased ride-sharing decrease the number of vehicles on the road. Michelangelo, therefore, stands as a vital asset for Uber, not just in enhancing its business operations but also in offering broader societal benefits.

### Conclusion

It comes as no surprise that the strategic pursuits of the world’s biggest technology firms depend critically on data science. From Google’s AI-driven approach to maintain Search’s market dominance, to Microsoft’s similar use of AI in Bing to drive disruption and dethrone Google Search, and Apple’s use of AR/VR to reimagine spatial computing, each priority fundamentally reflects a goal to transform data into business value with analytics.

In conclusion, the strategic pursuits of the world's biggest tech firms are intricately tied to the transformative power of advanced analytics. In the face of rapid technological evolution, a continuous pursuit for ever-better ways to unlock value from data places BigTechs at the forefront of innovation, and is pivotal in ensuring their continued relevance and influence.