# [Resource Minification]

* Date: [2022-05-29]

## Context and Problem Statement

[There is a lot of whitespace in the resources we send to the users which could
increase the load time for users with large resource files. Minifiying resources
will reduce resource files size and transmission size.]

## Considered Options

* [Do not minify resources]
* [Minify certain resources (HTML/CSS/JS)]
* [Minify all resources]

## Decision Outcome

Chosen option: "[option 1]", because [large resource files do not provide
sizeable benefit and would require adding new tools into our toolchain].

Minifying all resources only reduces network transmission size by 6kB and
full resource size by 41kB. While the full resource size is of sizeable benefit,
it doesn't reduce our load times outside a margin of error. Ultimately, we believe
that adding tools for minification may overcomplicate our tooling process for
developers and has a low bus factor.

<!-- markdownlint-disable-file MD013 -->

