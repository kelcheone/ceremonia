import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useOperatorsStore from "@/stores/operatorsStore";

type SearchAndFilterProps = {
  searchTerm: string;
  onSearchTermChange: (searchTerm: string) => void;
};

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchTermChange,
}) => {
  const filters = useOperatorsStore((state) => state.filters);
  const setFilters = useOperatorsStore((state) => state.setFilters);
  const onFilterChange = (filterName: string) => {
    if (filterName === "verified") {
      setFilters({ ...filters, verified: !filters.verified });
    }
    if (filterName === "dkgEnabled") {
      setFilters({ ...filters, dkgEnabled: !filters.dkgEnabled });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {(filters.verified || filters.dkgEnabled) && (
              <Badge variant="secondary" className="ml-2">
                {(filters.verified ? 1 : 0) + (filters.dkgEnabled ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={filters.verified}
                onCheckedChange={() => onFilterChange("verified")}
              />
              <label
                htmlFor="verified"
                className="text-sm font-medium leading-none"
              >
                Verified
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dkgEnabled"
                checked={filters.dkgEnabled}
                onCheckedChange={() => onFilterChange("dkgEnabled")}
              />
              <label
                htmlFor="dkgEnabled"
                className="text-sm font-medium leading-none"
              >
                DKG Enabled
              </label>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchAndFilter;
