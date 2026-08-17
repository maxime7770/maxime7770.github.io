---
layout: page
title: Projects
permalink: /projects/
description: Machine learning, optimization, analytics, and AI projects by Maxime Wolf.
nav: true
nav_order: 2
---

<div class="projects-index">
  <section class="featured-work" aria-labelledby="featured-projects-title">
    <header class="section-heading"><p class="eyebrow">Featured work</p><h2 id="featured-projects-title">Selected case studies and technical projects.</h2></header>
    <div class="featured-project-grid featured-project-grid--index">
      {% assign featured_titles = 'AI-Powered Email Assistant for CMA CGM|MIT Capstone Project|Sherlock Picasso|Optimizing Bus Stops Selection' | split: '|' %}
      {% for featured_title in featured_titles %}{% assign selected_project = site.projects | where: 'title', featured_title | first %}{% if selected_project %}{% include project_card.html project=selected_project featured=true %}{% endif %}{% endfor %}
    </div>
  </section>
  <section class="project-archive" aria-labelledby="all-projects-title">
    <header class="section-heading"><p class="eyebrow">Archive</p><h2 id="all-projects-title">All projects</h2><p class="section-description">A broader collection of work from MIT and personal projects.</p></header>
    {% assign project_categories = 'MIT|Personal projects' | split: '|' %}
    {% for category in project_categories %}
      {% assign categorized_projects = site.projects | where: 'category', category | sort: 'importance' %}
      <section class="archive-group" aria-labelledby="category-{{ forloop.index }}">
        <div class="archive-group-heading"><h3 id="category-{{ forloop.index }}">{{ category }}</h3><span>{{ categorized_projects.size }} projects</span></div>
        <div class="archive-project-grid">{% for project in categorized_projects %}{% include project_card.html project=project %}{% endfor %}</div>
      </section>
    {% endfor %}
  </section>
</div>
