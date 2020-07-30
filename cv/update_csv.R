# pull information from scholar ---------------------------------------------
library(scholar)
erinpubs = get_publications("ReD-s38AAAAJ&hl",
                 cstart = 0,
                 pagesize = 100,
                 flush = F)

# pull information from orcid ---------------------------------------------

library(rorcid)
erinorc = works(orcid_id("0000-0002-9689-4189"))

# set up dois -------------------------------------------------------------

#blank doi spot
erinorc$doi = NA 

#loop over the list of DF to get just the dois
for (i in 1:nrow(erinorc)){
  
  temp = erinorc$`external-ids.external-id`[[i]]
  
  if (length(temp) > 0 && length(temp[ temp$`external-id-type` == "doi" ,  "external-id-value" ] > 0)) {
    erinorc$doi[i] = temp[ temp$`external-id-type` == "doi" ,  "external-id-value" ]
    } #close if, this handles no dois and multiple ids

  } #close for loop

erinorc = erinorc[!duplicated(erinorc$title.title.value) , ]

# merge two pub lists -----------------------------------------------------

erinorc$title = erinorc$title.title.value
final = merge(erinpubs, erinorc, by = "title", all = T)

# compare with curated list -------------------------------------------------

library(readxl)
setwd("~/GitHub/Websites/cv markdown")
curated = as.data.frame(read_excel("cv_pubs.xlsx"))

c_pubid = na.omit(unlist(strsplit(gsub(" ", "", curated$pubid), ",")))
c_putcode = na.omit(unlist(strsplit(gsub(" ", "", curated$`put-code`), ",")))
f_pubid = na.omit(unlist(strsplit(gsub(" ", "", as.character(final$pubid)), ",")))
f_putcode = na.omit(unlist(strsplit(gsub(" ", "", final$`put-code`), ",")))

#find ones that aren't in the curated set from google
google_diff = setdiff(f_pubid, c_pubid)

#find ones that aren't in the curated set from orcid
orc_diff = setdiff(f_putcode, c_putcode)


newrows = final[ final$pubid %in% google_diff | 
                   final$`put-code` %in% orc_diff, ]

#update any X or XX that were place holders for the pages
updaterows = NA
temp = na.omit(curated[ , c("pubid", "volume")])
update = temp$pubid[temp$volume == "X"]

View(final[final$pubid %in% update, c("title", "number")])

#create an output for cutting and pasting
curated_check = matrix(NA, nrow = nrow(newrows), ncol = ncol(curated))
colnames(curated_check) = colnames(curated)
curated_check = as.data.frame(curated_check)

curated_check$doi = newrows$doi
curated_check$title = newrows$title
curated_check$author = newrows$author
curated_check$journal = newrows$journal
curated_check$volume = newrows$number
curated_check$year = newrows$year
curated_check$pubid = newrows$pubid
curated_check$`put-code` = newrows$`put-code`

write.csv(curated_check, "check_these.csv", row.names = F)
